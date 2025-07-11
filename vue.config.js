// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = {
  outputDir: process.env.OUTPUT || '../public/client',
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: {
      '/': {
        target: process.env.PROXY ? `${process.env.PROXY}` : 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      },
      '/api': {
        target: process.env.PROXY
          ? `${process.env.PROXY}/api`
          : 'http://localhost:3000/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/image': {
        target: process.env.PROXY
          ? `${process.env.PROXY}/image`
          : 'http://localhost:3000/image',
        changeOrigin: true,
        pathRewrite: {
          '^/image': ''
        }
      }
    }
  }
}
