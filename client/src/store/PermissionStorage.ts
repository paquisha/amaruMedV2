// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Module as ModuleX } from 'vuex-module-decorators'
import { VuexModule } from 'vuex-module-decorators'
import service from '@/services/PermissionService'
import { Mutation } from 'vuex-module-decorators'
import { Action } from 'vuex-module-decorators'
import userStore from '@/store/SessionStore'
import modStore from '@/store/ModuleStorage'
import { Modules } from '@/utils/modules'
import { Permission } from '@/models'
import { Module } from '@/models'

@ModuleX
export default class PermissionStore extends VuexModule {
  public elements: Permission[] = []

  @Mutation
  setPermissions(options: Permission[]) {
    this.elements = options
  }

  @Action({ commit: 'setPermissions' })
  async loadPermissions(mods: Modules[]): Promise<Permission[]> {
    return await service.find({
      where: {
        or: getQuery(mods)
      },
      fields: {
        roleId: true,
        moduleId: true,
        create: true,
        read: true,
        edit: true,
        del: true
      }
    })
  }
}
function getQuery(mods: Modules[]): any[] {
  return mods.map(element => {
    return { roleId: userStore.state.user.roleId, moduleId: getModuleId(element) }
  })
}

function getModuleId(mod: Modules): number | undefined {
  let id: number | undefined = undefined
  const elements: Module[] = modStore.state.elements
  id = elements.find(element => element.name === mod)?.id
  return id
}
