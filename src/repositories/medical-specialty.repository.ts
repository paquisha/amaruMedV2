// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DefaultCrudRepository } from '@loopback/repository'
import { MedicalSpecialtyRelations } from '../models'
import { AmaruMedPgcDataSource } from '../datasources'
import { MedicalSpecialty } from '../models'
import { inject } from '@loopback/core'

export class MedicalSpecialtyRepository extends DefaultCrudRepository<
  MedicalSpecialty,
  typeof MedicalSpecialty.prototype.id,
  MedicalSpecialtyRelations
> {
  constructor(@inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource) {
    super(MedicalSpecialty, dataSource)
  }
}
