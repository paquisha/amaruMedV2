// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { model } from '@loopback/repository'
import { Audit } from '.'
import { id } from './pg'
import { integer } from './pg'
import { boolean } from './pg'

@model({
  settings: {
    indexes: {
      uniquePermissionCombination: {
        keys: { roleId: 1, moduleId: 1 },
        options: { unique: true }
      }
    },
    foreignKeys: {
      fkPermissionRole: {
        name: 'fk_permission_role',
        entity: 'Role',
        entityKey: 'id',
        foreignKey: 'roleid'
      },
      fkPermissionModule: {
        name: 'fk_permission_module',
        entity: 'Module',
        entityKey: 'id',
        foreignKey: 'moduleid'
      }
    }
  }
})
export class Permission extends Audit {
  @id() id?: number

  @boolean({ default: false, required: true, columnName: 'c' })
  create: boolean

  @boolean({ default: true, required: true, columnName: 'r' })
  read: boolean

  @boolean({ default: false, required: true, columnName: 'u' })
  edit: boolean

  @boolean({ default: false, required: true, columnName: 'd' })
  del: boolean

  @integer({ required: true }) roleId: number

  @integer({ required: true }) moduleId: number

  constructor(data?: Partial<Permission>) {
    super(data)
  }
}

export interface PermissionRelations {
  // describe navigational properties here
}

export type PermissionWithRelations = Permission & PermissionRelations
