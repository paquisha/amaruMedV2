// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { RouteConfig } from 'vue-router'
const RootRoutes: RouteConfig = {
  path: '/',
  name: 'Root',
  component: () => import('@/views/root/RootPage.vue')
}
export default RootRoutes
