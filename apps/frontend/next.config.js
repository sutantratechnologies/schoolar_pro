//@ts-check

const path = require('node:path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/auth/sign-up', destination: '/signup', permanent: false },
      { source: '/auth/signup', destination: '/signup', permanent: false },
      { source: '/sign-up', destination: '/signup', permanent: false },
      { source: '/auth/register', destination: '/signup', permanent: false },
      { source: '/auth/login', destination: '/login', permanent: false },
      { source: '/auth/verify-email', destination: '/verify-email', permanent: false },
      { source: '/auth/forgot-password', destination: '/forgot-password', permanent: false },
      { source: '/auth/reset-password', destination: '/reset-password', permanent: false },
      { source: '/dashboard/onboarding', destination: '/onboarding', permanent: false },
    ];
  },
};

module.exports = nextConfig;
