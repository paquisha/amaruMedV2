// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DefaultCrudRepository } from '@loopback/repository'
import { VitalSign, VitalSignRelations } from '../models'
import { AmaruMedPgcDataSource } from '../datasources'
import { inject } from '@loopback/core'

export class VitalSignRepository extends DefaultCrudRepository<
  VitalSign,
  typeof VitalSign.prototype.id,
  VitalSignRelations
> {
  constructor(@inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource) {
    super(VitalSign, dataSource)
  }
}
