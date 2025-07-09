// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Entity } from '@loopback/repository'
import { model } from '@loopback/repository'
import { id } from './pg'
import { character } from './pg'

@model({
  settings: {
    indexes: {
      uniqueModuleName: {
        keys: { name: 1 },
        options: { unique: true }
      }
    }
  }
})
export class Module extends Entity {
  @id({ serial: false }) id?: number

  @character({ required: true, length: 25 }) name: string

  constructor(data?: Partial<Module>) {
    super(data)
  }
}

export interface ModuleRelations {
  // describe navigational properties here
}

export type ModuleWithRelations = Module & ModuleRelations
