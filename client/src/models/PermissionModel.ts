// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Base } from '@/models'

export interface Permission extends Base {
  create: boolean
  read: boolean
  edit: boolean
  del: boolean
  roleId: number
  moduleId: number
}

export function createPermission(): Permission {
  return {
    id: 0,
    create: false,
    read: false,
    edit: false,
    del: false,
    roleId: 0,
    moduleId: 0
  }
}
