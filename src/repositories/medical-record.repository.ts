// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { HasManyThroughRepositoryFactory } from '@loopback/repository'
import { MedicalExamRepository } from './medical-exam.repository'
import { DiagnosticRepository } from './diagnostic.repository'
import { HasOneRepositoryFactory } from '@loopback/repository'
import { VitalSignRepository } from './vital-sign.repository'
import { DefaultCrudRepository } from '@loopback/repository'
import { DiseaseRepository } from './disease.repository'
import { AmaruMedPgcDataSource } from '../datasources'
import { MedicalRecordRelations, Rpe, Cros } from '../models'
import { ExamRepository } from './exam.repository'
import { repository } from '@loopback/repository'
import { inject, Getter } from '@loopback/core'
import { MedicalRecord } from '../models'
import { MedicalExam } from '../models'
import { Diagnostic } from '../models'
import { VitalSign } from '../models'
import { Disease } from '../models'
import { Exam } from '../models'
import { RpeRepository } from './rpe.repository'
import { CrosRepository } from './cros.repository'

export class MedicalRecordRepository extends DefaultCrudRepository<
  MedicalRecord,
  typeof MedicalRecord.prototype.id,
  MedicalRecordRelations
> {
  public readonly vitalSign: HasOneRepositoryFactory<
    VitalSign,
    typeof MedicalRecord.prototype.id
  >

  public readonly diseases: HasManyThroughRepositoryFactory<
    Disease,
    typeof Disease.prototype.id,
    Diagnostic,
    typeof MedicalRecord.prototype.id
  >

  public readonly exams: HasManyThroughRepositoryFactory<
    Exam,
    typeof Exam.prototype.id,
    MedicalExam,
    typeof MedicalRecord.prototype.id
  >

  public readonly rpe: HasOneRepositoryFactory<Rpe, typeof MedicalRecord.prototype.id>

  public readonly cros: HasOneRepositoryFactory<Cros, typeof MedicalRecord.prototype.id>

  constructor(
    @inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource,
    @repository.getter('VitalSignRepository')
    protected vitalSignRepositoryGetter: Getter<VitalSignRepository>,
    @repository.getter('DiagnosticRepository')
    protected diagnosticRepositoryGetter: Getter<DiagnosticRepository>,
    @repository.getter('DiseaseRepository')
    protected diseaseRepositoryGetter: Getter<DiseaseRepository>,
    @repository.getter('MedicalExamRepository')
    protected medicalExamRepositoryGetter: Getter<MedicalExamRepository>,
    @repository.getter('ExamRepository')
    protected examRepositoryGetter: Getter<ExamRepository>,
    @repository.getter('RpeRepository')
    protected rpeRepositoryGetter: Getter<RpeRepository>,
    @repository.getter('CrosRepository')
    protected crosRepositoryGetter: Getter<CrosRepository>
  ) {
    super(MedicalRecord, dataSource)
    this.cros = this.createHasOneRepositoryFactoryFor('cros', crosRepositoryGetter)
    this.registerInclusionResolver('cros', this.cros.inclusionResolver)
    this.rpe = this.createHasOneRepositoryFactoryFor('rpe', rpeRepositoryGetter)
    this.registerInclusionResolver('rpe', this.rpe.inclusionResolver)
    this.exams = this.createHasManyThroughRepositoryFactoryFor(
      'exams',
      examRepositoryGetter,
      medicalExamRepositoryGetter
    )
    this.diseases = this.createHasManyThroughRepositoryFactoryFor(
      'diseases',
      diseaseRepositoryGetter,
      diagnosticRepositoryGetter
    )
    this.vitalSign = this.createHasOneRepositoryFactoryFor(
      'vitalSign',
      vitalSignRepositoryGetter
    )
    this.registerInclusionResolver('vitalSign', this.vitalSign.inclusionResolver)
  }
}
