// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { RouteConfig } from 'vue-router'

const RestoreAccountRoutes: RouteConfig = {
  path: '/restore',
  name: 'RestoreAccount',
  component: () => import('@/views/password/PasswordRestorePage.vue')
}
export default RestoreAccountRoutes
