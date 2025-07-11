// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { VuexModule } from 'vuex-module-decorators'
import { Mutation } from 'vuex-module-decorators'
import { Module } from 'vuex-module-decorators'
import { Action } from 'vuex-module-decorators'
import service from '@/services/OptionService'
import { Option } from '@/models'

@Module
export default class OptionStore extends VuexModule {
  public elements: Option[] = []

  @Mutation
  setOptions(options: Option[]) {
    this.elements = options
  }

  @Action({ commit: 'setOptions' })
  async loadOptions(): Promise<Option[]> {
    let elements: Option[] = []
    if (this.elements.length === 0) {
      elements = await service.find({
        where: { deleted: false },
        fields: { id: true, name: true, groupId: true }
      })
    } else {
      elements = this.elements
    }
    return elements
  }

  @Action({})
  async optionNameById(id: number): Promise<string | undefined> {
    return this.elements.find(item => item.id === id)?.name
  }
}
