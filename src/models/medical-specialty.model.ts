// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { model } from '@loopback/repository'
import { character } from './pg'
import { Audit } from '.'
import { id } from './pg'

@model()
export class MedicalSpecialty extends Audit {
  @id() id?: number

  @character({ length: 75, required: true }) name: string

  @character({ length: 150 }) description: string

  constructor(data?: Partial<MedicalSpecialty>) {
    super(data)
  }
}

export interface MedicalSpecialtyRelations {
  // describe navigational properties here
}

export type MedicalSpecialtyWithRelations = MedicalSpecialty & MedicalSpecialtyRelations
