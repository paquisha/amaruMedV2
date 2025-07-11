// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { VuexModule } from 'vuex-module-decorators'
import { Mutation } from 'vuex-module-decorators'
import { Module as ModuleX } from 'vuex-module-decorators'
import { Action } from 'vuex-module-decorators'
import service from '@/services/ModuleService'
import { Module } from '@/models'

@ModuleX
export default class ModuleStore extends VuexModule {
  public elements: Module[] = []

  @Mutation
  setModules(options: Module[]) {
    this.elements = options
  }

  @Action({ commit: 'setModules' })
  async loadModulesAllowed(id: number): Promise<Module[]> {
    let elements: Module[] = []
    if (this.elements.length === 0) {
      elements = await service.findAllowedToMe({ fields: { id: true, name: true } })
    } else {
      elements = this.elements
    }
    return elements
  }
}
