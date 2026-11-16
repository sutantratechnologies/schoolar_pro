//@ts-check

const path = require('node:path');
require('dotenv').config({
  path: path.resolve(__dirname, '../../.env'),
});

const isProd = process.env.NODE_ENV === 'production';
const adminUrl = process.env.ADMIN_URL || (isProd ? 'https://admin.bidyago.com' : 'http://localhost:3001');
const workspaceUrl = process.env.WORKSPACE_URL || (isProd ? 'https://workspace.bidyago.com' : 'http://localhost:3002');

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_TARGET: 'main',
  },
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
      { source: '/admin', destination: `${adminUrl}/admin`, permanent: false },
      { source: '/admin/:path*', destination: `${adminUrl}/admin/:path*`, permanent: false },
      { source: '/organizations', destination: workspaceUrl, permanent: false },
      { source: '/organizations/:path*', destination: `${workspaceUrl}/dashboard`, permanent: false },
    ];
  },
};

module.exports = nextConfig;
