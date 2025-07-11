// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import es from 'vuetify/src/locale/es'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: sessionStorage.getItem('primary') || '#fff',
        secondary: sessionStorage.getItem('secondary') || '#fff'
      },
      dark: {
        primary: sessionStorage.getItem('primary') || '#505050',
        secondary: sessionStorage.getItem('secondary') || '#505050'
      }
    }
  },
  lang: {
    locales: { es },
    current: 'es'
  },
  icons: {
    iconfont: 'fa'
  }
})
