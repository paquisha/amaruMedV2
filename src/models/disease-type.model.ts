// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { hasMany } from '@loopback/repository'
import { model } from '@loopback/repository'
import { Disease } from './disease.model'
import { character } from './pg'
import { id } from './pg'
import { Audit } from '.'

@model()
export class DiseaseType extends Audit {
  @id() id?: number

  @character({ length: 100, required: true }) name: string

  @hasMany(() => Disease) diseases: Disease[]

  constructor(data?: Partial<DiseaseType>) {
    super(data)
  }
}

export interface DiseaseTypeRelations {
  // describe navigational properties here
}

export type DiseaseTypeWithRelations = DiseaseType & DiseaseTypeRelations
