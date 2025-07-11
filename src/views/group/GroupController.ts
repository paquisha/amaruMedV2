// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Component from 'vue-class-component'
import optionService from '@/services/OptionService'
import groupService from '@/services/GroupService'
import { Group } from '@/models'
import options from '@/views/option/OptionComponent.vue'
import alert from '@/utils/alert'

@Component({ name: 'group-page', components: { options } })
export default class GroupController extends Vue {
  /********************************************************
   *                      Attributes                       *
   ********************************************************/

  // GUI

  // Element data
  private groups: Group[] = []

  // Validations

  /********************************************************
   *                     Initializable                     *
   ********************************************************/
  beforeMount(): void {
    this.loadGroups()
  }

  /********************************************************
   *                    API Services                       *
   ********************************************************/

  private async loadGroups(): Promise<void> {
    await groupService.find().then(groups => {
      this.groups = groups
    })
  }
}
