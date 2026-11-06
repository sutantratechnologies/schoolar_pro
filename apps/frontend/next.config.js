//@ts-check

const path = require('node:path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js options go here
  // See: https://nextjs.org/docs/app/api-reference/config/next-config-js
};

module.exports = nextConfig;
