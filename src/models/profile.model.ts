// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { hasOne } from '@loopback/repository'
import { model } from '@loopback/repository'
import { User } from './user.model'
import { Audit } from '.'
import { id } from './pg'
import { dni } from './pg'
import { phone } from './pg'
import { email } from './pg'
import { address } from './pg'
import { passport } from './pg'
import { filename } from './pg'
import { character } from './pg'

@model({
  settings: {
    indexes: {
      uniqueProfileEmail: {
        keys: { email: 1 },
        options: { unique: true }
      },
      uniqueProfileDni: {
        keys: { dni: 1 },
        options: { unique: true }
      },
      uniqueProfilePassport: {
        keys: { passport: 1 },
        options: { unique: true }
      }
    }
  }
})
export class Profile extends Audit {
  @id() id?: number

  @dni({}) dni?: string

  @passport({}) passport?: string

  @character({ required: true, length: 25 }) lastName: string

  @character({ required: true, length: 25 }) firstName: string

  @phone({}) telephone?: string

  @phone({}) mobile?: string

  @email({ required: true }) email: string

  @filename({}) image?: string

  @address({ required: true }) address: string

  @hasOne(() => User)
  user: User

  constructor(data?: Partial<Profile>) {
    super(data)
  }
}

export interface ProfileRelations {
  // describe navigational properties here
}

export type ProfileWithRelations = Profile & ProfileRelations
