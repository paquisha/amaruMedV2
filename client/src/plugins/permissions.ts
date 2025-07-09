// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import { Permission } from '@/models'
import { Module } from '@/models'

Vue.mixin({
  methods: {
    $modules(): string[] {
      return this.$store.state.module.elements.map((element: Module) => element.name)
    },

    $permissions(module: string): Permission | null {
      let per: Permission | null = null
      const mod: Module = this.$store.state.module.elements.find(
        (element: Module) => element.name === module
      )
      if (mod)
        per = this.$store.state.permission.elements.find(
          (element: Permission) => element.moduleId === mod.id
        )
      return per
    },
    $access(module: string): boolean {
      // @ts-ignore
      return this.$modules().includes(module)
    },
    $canCreate(module: string): boolean {
      //@ts-ignore
      const per: Permission = this.$permissions(module)
      return per ? per.create : false
    },
    $canRead(module: string): boolean {
      //@ts-ignore
      const per: Permission = this.$permissions(module)
      return per ? per.read : false
    },
    $canEdit(module: string): boolean {
      //@ts-ignore
      const per: Permission = this.$permissions(module)
      return per ? per.edit : false
    },
    $canDelete(module: string): boolean {
      //@ts-ignore
      const per: Permission = this.$permissions(module)
      return per ? per.del : false
    }
  }
})
