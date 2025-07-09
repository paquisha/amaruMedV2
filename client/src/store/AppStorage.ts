// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { VuexModule } from 'vuex-module-decorators'
import { Mutation } from 'vuex-module-decorators'
import { Module } from 'vuex-module-decorators'
import App from '@/utils/AppInfo'

@Module
export default class SessionStore extends VuexModule {
  public info: App = { name: '', version: '', company: { name: '', logo: '' } }

  @Mutation
  setApp(app: App) {
    app.name = app.name.charAt(0).toUpperCase() + app.name.slice(1)
    this.info = app
  }
}
