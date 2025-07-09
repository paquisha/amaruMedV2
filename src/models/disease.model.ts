// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DiseaseType } from './disease-type.model'
import { belongsTo } from '@loopback/repository'
import { model } from '@loopback/repository'
import { character } from './pg'
import { text } from './pg'
import { id } from './pg'
import { Audit } from '.'

@model({
  settings: {
    foreignKeys: {
      fkUserRole: {
        name: 'fk_disease_diseasetype',
        entity: 'DiseaseType',
        entityKey: 'id',
        foreignKey: 'diseasetypeid'
      }
    }
  }
})
export class Disease extends Audit {
  @id() id?: number

  @character({ length: 10 }) code?: string

  @text({}) name: string

  @text({}) description?: string

  @text({}) actions?: string

  @belongsTo(() => DiseaseType, {}, { required: true }) diseaseTypeId: number

  constructor(data?: Partial<Disease>) {
    super(data)
  }
}

export interface DiseaseRelations {
  // describe navigational properties here
}

export type DiseaseWithRelations = Disease & DiseaseRelations
