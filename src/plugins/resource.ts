// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Resource from 'vue-resource'
// eslint-disable-next-line
// @ts-ignore
import VueProgressBar from 'vue-progressbar'
// eslint-disable-next-line
// @ts-ignore
import Interceptor from 'vue-resource-progressbar-interceptor'

const options = {
  color: 'rgba(255,255,255,0.5)',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.2s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

Vue.use(Resource)
Vue.use(VueProgressBar, options)
Vue.use(Interceptor)

// User authorization token
const token = sessionStorage.getItem('token')
// eslint-disable-next-line
// @ts-ignore
Vue.http.headers.common['Authorization'] = token
