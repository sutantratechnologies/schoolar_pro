//@ts-check

const path = require('node:path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_TARGET: 'workspace',
  },
  async redirects() {
    return [
      { source: '/organizations', destination: '/dashboard', permanent: false },
      { source: '/organizations/college', destination: '/dashboard/college', permanent: false },
      { source: '/organizations/consultancy', destination: '/dashboard/consultancy', permanent: false },
      { source: '/auth/login', destination: '/login', permanent: false },
    ];
  },
};

module.exports = nextConfig;

