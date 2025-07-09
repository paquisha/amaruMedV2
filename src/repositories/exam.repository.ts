// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DefaultCrudRepository } from '@loopback/repository'
import { ExamTypeRepository } from './exam-type.repository'
import { BelongsToAccessor } from '@loopback/repository'
import { AmaruMedPgcDataSource } from '../datasources'
import { repository } from '@loopback/repository'
import { inject, Getter } from '@loopback/core'
import { ExamRelations } from '../models'
import { ExamType } from '../models'
import { Exam } from '../models'

export class ExamRepository extends DefaultCrudRepository<
  Exam,
  typeof Exam.prototype.id,
  ExamRelations
> {
  public readonly examType: BelongsToAccessor<ExamType, typeof Exam.prototype.id>

  constructor(
    @inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource,
    @repository.getter('ExamTypeRepository')
    protected examTypeRepositoryGetter: Getter<ExamTypeRepository>
  ) {
    super(Exam, dataSource)
    this.examType = this.createBelongsToAccessorFor('examType', examTypeRepositoryGetter)
    this.registerInclusionResolver('examType', this.examType.inclusionResolver)
  }
}
