// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { RouteConfig } from 'vue-router'
const ActivateRoutes: RouteConfig = {
  path: '/activate',
  name: 'Activate',
  component: () => import('@/views/password/PasswordSetterPage.vue')
}
export default ActivateRoutes
