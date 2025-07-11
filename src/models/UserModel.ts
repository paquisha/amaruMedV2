// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Base } from '@/models'
import { Role } from '@/models'

export interface User extends Base {
  email: string
  isActive: boolean
  roleId: number
  profileId: number
  readonly role?: Role
}

export function createUser(): User {
  return {
    id: 0,
    email: '',
    isActive: false,
    roleId: 0,
    profileId: 0
  }
}
