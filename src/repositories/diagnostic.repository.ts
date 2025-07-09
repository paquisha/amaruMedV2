// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { DefaultCrudRepository } from '@loopback/repository'
import { AmaruMedPgcDataSource } from '../datasources'
import { DiagnosticRelations } from '../models'
import { Diagnostic } from '../models'
import { inject } from '@loopback/core'

export class DiagnosticRepository extends DefaultCrudRepository<
  Diagnostic,
  typeof Diagnostic.prototype.id,
  DiagnosticRelations
> {
  constructor(@inject('datasources.amarumedPGC') dataSource: AmaruMedPgcDataSource) {
    super(Diagnostic, dataSource)
  }
}
