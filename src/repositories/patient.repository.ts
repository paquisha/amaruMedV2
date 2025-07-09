// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { MedicalRecordRepository } from './medical-record.repository'
import { HasManyRepositoryFactory } from '@loopback/repository'
import { AntecedentRepository } from './antecedent.repository'
import { HasOneRepositoryFactory } from '@loopback/repository'
import { DefaultCrudRepository } from '@loopback/repository'
import { AmaruMedPgcDataSource } from '../datasources'
import { repository } from '@loopback/repository'
import { inject, Getter } from '@loopback/core'
import { PatientRelations } from '../models'
import { MedicalRecord } from '../models'
import { Antecedent } from '../models'
import { Patient } from '../models'

export class PatientRepository extends DefaultCrudRepository<
  Patient,
  typeof Patient.prototype.id,
  PatientRelations
> {
  public readonly antecedent: HasOneRepositoryFactory<
    Antecedent,
    typeof Patient.prototype.id
  >

  public readonly medicalRecords: HasManyRepositoryFactory<
    MedicalRecord,
    typeof Patient.prototype.id
  >

  constructor(
    @inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource,
    @repository.getter('AntecedentRepository')
    protected antecedentRepositoryGetter: Getter<AntecedentRepository>,
    @repository.getter('MedicalRecordRepository')
    protected medicalRecordRepositoryGetter: Getter<MedicalRecordRepository>
  ) {
    super(Patient, dataSource)
    this.medicalRecords = this.createHasManyRepositoryFactoryFor(
      'medicalRecords',
      medicalRecordRepositoryGetter
    )
    this.registerInclusionResolver(
      'medicalRecords',
      this.medicalRecords.inclusionResolver
    )
    this.antecedent = this.createHasOneRepositoryFactoryFor(
      'antecedent',
      antecedentRepositoryGetter
    )
    this.registerInclusionResolver('antecedent', this.antecedent.inclusionResolver)
  }
}
