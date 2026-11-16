//@ts-check

const path = require('node:path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_TARGET: 'portal',
  },
  async redirects() {
    return [
      { source: '/admin', destination: '/dashboard', permanent: false },
      { source: '/admin/super', destination: '/dashboard/super', permanent: false },
      { source: '/auth/login', destination: '/login', permanent: false },
    ];
  },
};

module.exports = nextConfig;

