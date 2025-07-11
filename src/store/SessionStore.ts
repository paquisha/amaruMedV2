// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import accountService from '@/services/AccountService'
import { VuexModule } from 'vuex-module-decorators'
import { Mutation } from 'vuex-module-decorators'
import { Module } from 'vuex-module-decorators'
import { Action } from 'vuex-module-decorators'
import { Medic, Role, User } from '@/models'
import { Profile } from '@/models'
import store from '@/store'

@Module
export default class SessionStore extends VuexModule {
  public user: User | null = null
  public role: Role | null = null
  public profile: Profile | null = null
  public isMedic: boolean = false
  public medic: Medic | null = null

  @Mutation
  setProfile(data: {
    user: User | null
    role: Role | null
    profile: Profile | null
    isMedic: boolean
    medic: Medic | null
  }) {
    this.user = data.user
    this.role = data.role
    this.profile = data.profile
    this.isMedic = data.isMedic
    this.medic = data.medic

    const roleName = store.state.session.role?.name
    document.title = `${store.state.app.info.name} ${
      roleName ? ` - ${roleName.toLowerCase()}` : ''
    }`
  }

  @Action({ commit: 'setProfile' })
  async loadProfile(): Promise<{
    user: User
    profile: Profile
    isMedic: boolean
    medic?: Medic
  }> {
    return await accountService.me()
  }
}
