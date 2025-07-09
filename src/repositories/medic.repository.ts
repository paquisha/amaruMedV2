// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { MedicalSpecialtyRepository } from './medical-specialty.repository'
import { HasManyThroughRepositoryFactory } from '@loopback/repository'
import { MedicalRecordRepository } from './medical-record.repository'
import { HasManyRepositoryFactory } from '@loopback/repository'
import { SpecialistRepository } from './specialist.repository'
import { DefaultCrudRepository } from '@loopback/repository'
import { AmaruMedPgcDataSource } from '../datasources'
import { repository } from '@loopback/repository'
import { inject, Getter } from '@loopback/core'
import { MedicalSpecialty } from '../models'
import { MedicRelations } from '../models'
import { MedicalRecord } from '../models'
import { Specialist } from '../models'
import { Medic } from '../models'

export class MedicRepository extends DefaultCrudRepository<
  Medic,
  typeof Medic.prototype.id,
  MedicRelations
> {
  public readonly medicalRecords: HasManyRepositoryFactory<
    MedicalRecord,
    typeof Medic.prototype.id
  >

  public readonly medicalSpecialties: HasManyThroughRepositoryFactory<
    MedicalSpecialty,
    typeof MedicalSpecialty.prototype.id,
    Specialist,
    typeof Medic.prototype.id
  >

  constructor(
    @inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource,
    @repository.getter('MedicalRecordRepository')
    protected medicalRecordRepositoryGetter: Getter<MedicalRecordRepository>,
    @repository.getter('SpecialistRepository')
    protected specialistRepositoryGetter: Getter<SpecialistRepository>,
    @repository.getter('MedicalSpecialtyRepository')
    protected medicalSpecialtyRepositoryGetter: Getter<MedicalSpecialtyRepository>
  ) {
    super(Medic, dataSource)
    this.medicalSpecialties = this.createHasManyThroughRepositoryFactoryFor(
      'medicalSpecialties',
      medicalSpecialtyRepositoryGetter,
      specialistRepositoryGetter
    )
    this.medicalRecords = this.createHasManyRepositoryFactoryFor(
      'medicalRecords',
      medicalRecordRepositoryGetter
    )
    this.registerInclusionResolver(
      'medicalRecords',
      this.medicalRecords.inclusionResolver
    )
  }
}
