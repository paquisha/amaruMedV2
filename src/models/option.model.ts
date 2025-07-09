// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { belongsTo } from '@loopback/repository'
import { model } from '@loopback/repository'
import { Audit } from '.'
import { id } from './pg'
import { character } from './pg'
import { Group } from '.'

@model({
  settings: {
    foreignKeys: {
      fkOptionGroup: {
        name: 'fk_option_group',
        entity: 'tgroup',
        entityKey: 'id',
        foreignKey: 'groupid'
      }
    },
    indexes: {
      uniqueOptionCombination: {
        keys: { name: 1, groupid: 1 },
        options: { unique: true }
      }
    }
  }
})
export class Option extends Audit {
  @id() id?: number

  @character({ required: true, length: 75 }) name: string

  @belongsTo(() => Group, {}, { required: true }) groupId: number

  constructor(data?: Partial<Option>) {
    super(data)
  }
}

export interface OptionRelations {
  // describe navigational properties here
}

export type OptionWithRelations = Option & OptionRelations
