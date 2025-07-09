// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { model } from '@loopback/repository'
import { integer } from './pg'
import { id } from './pg'
import { Audit } from '.'

@model({
  settings: {
    foreignKeys: {
      fkSpecialistMedSPE: {
        name: 'fk_specialist_medspe',
        entity: 'MedicalSpecialty',
        entityKey: 'id',
        foreignKey: 'medicalspecialtyid'
      },
      fkSpecialistMedic: {
        name: 'fk_specialist_medic',
        entity: 'Medic',
        entityKey: 'id',
        foreignKey: 'medicid'
      }
    }
  }
})
export class Specialist extends Audit {
  @id() id?: number

  @integer({ required: true }) medicId?: number

  @integer({ required: true }) medicalSpecialtyId?: number

  constructor(data?: Partial<Specialist>) {
    super(data)
  }
}

export interface SpecialistRelations {
  // describe navigational properties here
}

export type SpecialistWithRelations = Specialist & SpecialistRelations
