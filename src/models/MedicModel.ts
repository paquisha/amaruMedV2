// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Base } from '@/models'

export interface Medic extends Base {
  dni?: string
  passport?: string
  lastName: string
  firstName: string
  image?: string
  telephone?: string
  mobile?: string
  email?: string
  address: string
  regProfessional: string
  userId: number
}

export function createMedic(): Medic {
  return {
    id: 0,
    firstName: '',
    lastName: '',
    address: '',
    regProfessional: '',
    userId: 0
  }
}
