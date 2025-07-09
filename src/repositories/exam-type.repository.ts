// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { HasManyRepositoryFactory } from '@loopback/repository'
import { DefaultCrudRepository } from '@loopback/repository'
import { AmaruMedPgcDataSource } from '../datasources'
import { repository } from '@loopback/repository'
import { ExamRepository } from './exam.repository'
import { ExamTypeRelations } from '../models'
import { Getter } from '@loopback/core'
import { inject } from '@loopback/core'
import { ExamType } from '../models'
import { Exam } from '../models'

export class ExamTypeRepository extends DefaultCrudRepository<
  ExamType,
  typeof ExamType.prototype.id,
  ExamTypeRelations
> {
  public readonly exams: HasManyRepositoryFactory<Exam, typeof ExamType.prototype.id>

  constructor(
    @inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource,
    @repository.getter('ExamRepository')
    protected examRepositoryGetter: Getter<ExamRepository>
  ) {
    super(ExamType, dataSource)
    this.exams = this.createHasManyRepositoryFactoryFor('exams', examRepositoryGetter)
    this.registerInclusionResolver('exams', this.exams.inclusionResolver)
  }
}
