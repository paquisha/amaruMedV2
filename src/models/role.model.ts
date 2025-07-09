// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { hasMany } from '@loopback/repository'
import { model } from '@loopback/repository'
import { Audit } from '.'
import { Module } from './module.model'
import { Permission } from './permission.model'
import { id } from './pg'
import { character } from './pg'

@model({
  settings: {
    indexes: {
      uniqueRoleName: {
        keys: { name: 1 },
        options: { unique: true }
      }
    }
  }
})
export class Role extends Audit {
  @id() id?: number

  @character({ required: true, length: 25 })
  name: string

  @character({ required: true, length: 150 })
  description: string

  @hasMany(() => Module, { through: { model: () => Permission } })
  modules: Module[]

  constructor(data?: Partial<Role>) {
    super(data)
  }
}

export interface RoleRelations {
  // describe navigational properties here
}

export type RoleWithRelations = Role & RoleRelations
