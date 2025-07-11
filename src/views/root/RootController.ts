// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Component from 'vue-class-component'
import { hasValidToken } from '@/utils/auth'

@Component({ name: 'root-page' })
export default class RootController extends Vue {
  async created(): Promise<void> {
    if (hasValidToken()) {
      this.$router.push({ name: 'App' })
    } else {
      this.$router.push({ name: 'Login' })
    }
  }
}
