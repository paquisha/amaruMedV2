// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Vuex from 'vuex'
import app from '@/store/AppStorage'
import session from '@/store/SessionStore'
import option from '@/store/OptionStorage'
import module from '@/store/ModuleStorage'
import permission from '@/store/PermissionStorage'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { app, module, permission, session, option }
})
