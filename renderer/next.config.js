/** @type {import('next').NextConfig} */
module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
    }

    return config;
  },

  reactStrictMode: false,
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '' : '',
  publicRuntimeConfig: {
      contextPath: process.env.NODE_ENV === 'production' ? '' : '',
      api: process.env.APIV_1,
  },



};
