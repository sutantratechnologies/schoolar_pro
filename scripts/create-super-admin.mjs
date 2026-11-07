#!/usr/bin/env node

import { randomUUID } from 'node:crypto';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import pg from 'pg';
import { hashPassword } from 'better-auth/crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env
dotenv.config({ path: path.join(rootDir, '.env') });

const { Client } = pg;

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {};
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const eqIdx = arg.indexOf('=');
      if (eqIdx !== -1) {
        const key = arg.slice(2, eqIdx).trim();
        const value = arg.slice(eqIdx + 1).trim();
        parsed[key] = value;
      }
    }
  }
  return parsed;
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ Error: DATABASE_URL is not set in your .env file.');
    process.exit(1);
  }

  const args = parseArgs();
  let email = args.email;
  let name = args.name;
  let password = args.password;

  const rl = readline.createInterface({ input, output });

  try {
    console.log('\n========================================');
    console.log('   BidyaGo - Create Super Admin Account  ');
    console.log('========================================\n');

    if (!email) {
      email = await rl.question('Enter Super Admin Email [admin@bidyago.com]: ');
      email = email.trim() || 'admin@bidyago.com';
    }

    if (!name) {
      name = await rl.question('Enter Full Name [Super Admin]: ');
      name = name.trim() || 'Super Admin';
    }

    if (!password) {
      password = await rl.question('Enter Password (min 8 chars): ');
      password = password.trim();
    }

    if (!email.includes('@')) {
      console.error('❌ Error: Invalid email format.');
      process.exit(1);
    }

    if (!password || password.length < 8) {
      console.error('❌ Error: Password must be at least 8 characters long.');
      process.exit(1);
    }

    console.log(`\nConnecting to database...`);
    const client = new Client({ connectionString: databaseUrl });
    await client.connect();

    try {
      // 1. Check if user already exists
      const existingUserRes = await client.query(
        'SELECT id, email, role FROM "user" WHERE LOWER(email) = LOWER($1)',
        [email]
      );

      const hashedPassword = await hashPassword(password);
      const now = new Date();

      if (existingUserRes.rows.length > 0) {
        const existingUser = existingUserRes.rows[0];
        console.log(`\nUser with email "${email}" already exists (current role: ${existingUser.role}).`);
        console.log(`Upgrading user to SUPER_ADMIN and updating password...`);

        // Update user role and verify email
        await client.query(
          'UPDATE "user" SET role = $1, "emailVerified" = true, name = $2, "updatedAt" = $3 WHERE id = $4',
          ['SUPER_ADMIN', name, now, existingUser.id]
        );

        // Check if credential account exists
        const accountRes = await client.query(
          'SELECT id FROM "account" WHERE "userId" = $1 AND "providerId" = $2',
          [existingUser.id, 'credential']
        );

        if (accountRes.rows.length > 0) {
          await client.query(
            'UPDATE "account" SET password = $1, "updatedAt" = $2 WHERE id = $3',
            [hashedPassword, now, accountRes.rows[0].id]
          );
        } else {
          await client.query(
            'INSERT INTO "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [randomUUID(), existingUser.id, 'credential', existingUser.id, hashedPassword, now, now]
          );
        }

        console.log('\n✅ User successfully upgraded to SUPER_ADMIN!');
      } else {
        const userId = randomUUID();
        const accountId = randomUUID();

        console.log(`\nCreating new SUPER_ADMIN user...`);

        // Insert user
        await client.query(
          'INSERT INTO "user" (id, name, email, "emailVerified", role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [userId, name, email.toLowerCase().trim(), true, 'SUPER_ADMIN', now, now]
        );

        // Insert credential account
        await client.query(
          'INSERT INTO "account" (id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [accountId, userId, 'credential', userId, hashedPassword, now, now]
        );

        console.log('\n✅ Super Admin account created successfully!');
      }

      console.log('\n----------------------------------------');
      console.log('Account Details:');
      console.log(`  • Email:    ${email}`);
      console.log(`  • Role:     SUPER_ADMIN`);
      console.log(`  • Status:   Email Verified (Active)`);
      console.log('\nSign In Instructions:');
      console.log('  1. Start the Admin portal and backend:');
      console.log('     npm run dev:admin');
      console.log('     npm run dev:backend');
      console.log('  2. Visit Admin Portal:');
      console.log('     http://localhost:3001/login (or admin.bidyago.com)');
      console.log('  3. Log in with the email and password above.');
      console.log('  4. Access Super Admin controls at:');
      console.log('     http://localhost:3001/dashboard/super');
      console.log('----------------------------------------\n');
    } finally {
      await client.end();
    }
  } catch (error) {
    console.error('\n❌ Failed to create super admin:', error.message || error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();

