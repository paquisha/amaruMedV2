// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import moment from 'moment'
moment.locale('es')

Vue.mixin({
  methods: {
    $formatDate(date: string): string {
      return date ? moment(date).format('LL') : ''
    },

    $formatDateISO(date: string): string {
      return date ? new Date(date).toISOString().substr(0, 10) : ''
    },

    $formatDateTime(date: string): string {
      return date ? moment(date).format('LLL') : ''
    },

    $calcAge(date: string): number {
      var birthday = +new Date(date)
      return ~~((Date.now() - birthday) / 31557600000)
    }
  }
})
