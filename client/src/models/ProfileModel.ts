// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Base } from '@/models'
import { User } from '@/models'
import { createUser } from './UserModel'

export interface Profile extends Base {
  dni?: string
  passport?: string
  lastName: string
  firstName: string
  telephone?: string
  mobile?: string
  email?: string
  image?: string
  address: string
  user?: User
}

export function createProfile(): Profile {
  return {
    id: 0,
    firstName: '',
    lastName: '',
    address: '',
    user: createUser()
  }
}
