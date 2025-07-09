// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import RestorePassword from '@/router/RestorePasswordRouter'
import RestoreAccount from '@/router/RestoreAccountRouter'
import { NavigationGuardNext } from 'vue-router'
import Activate from '@/router/ActivateRouter'
import { hasValidToken } from '@/utils/auth'
import Login from '@/router/LoginRouter'
import { RouteConfig } from 'vue-router'
import Root from '@/router/RootRouter'
import app from '@/router/AppRouter'
import { Route } from 'vue-router'
import VueRouter from 'vue-router'
import store from '@/store'
import Vue from 'vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  Root,
  RestorePassword,
  RestoreAccount,
  Activate,
  Login,
  app
]

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to: Route, from: Route, next: NavigationGuardNext) => {
  to.matched.some(async record => {
    if (record.meta.auth) {
      if (hasValidToken()) {
        // If the account info is not loaded
        if (!store.state.session.user) {
          await store.dispatch('loadProfile')
          await store.dispatch('loadModulesAllowed')
        }

        // load permission
        if (to.meta.modules) {
          await store.dispatch('loadPermissions', to.meta.modules)
        }
        next()
      } else {
        next({ name: 'Root' })
      }
    } else {
      next()
    }
  })
})
export default router
