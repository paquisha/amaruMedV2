// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DefaultCrudRepository } from '@loopback/repository'
import { AmaruMedPgcDataSource } from '../datasources'
import { MedicalExamRelations } from '../models'
import { MedicalExam } from '../models'
import { inject } from '@loopback/core'

export class MedicalExamRepository extends DefaultCrudRepository<
  MedicalExam,
  typeof MedicalExam.prototype.id,
  MedicalExamRelations
> {
  constructor(@inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource) {
    super(MedicalExam, dataSource)
  }
}
