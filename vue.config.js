// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = {
  outputDir: process.env.OUTPUT || 'dist',
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: {
      '/': {
        target: process.env.PROXY ? `${process.env.PROXY}` : 'https://amarumed-backend-webapp.azurewebsites.net',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        }
      },
      '/api': {
        target: process.env.PROXY
          ? `${process.env.PROXY}/api`
          : 'https://amarumed-backend-webapp.azurewebsites.net/api',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/image': {
        target: process.env.PROXY
          ? `${process.env.PROXY}/image`
          : 'https://amarumed-backend-webapp.azurewebsites.net/image',
        changeOrigin: true,
        pathRewrite: {
          '^/image': ''
        }
      }
    }
  }
}
