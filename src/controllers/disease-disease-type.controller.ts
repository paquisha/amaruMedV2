// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { authenticate } from '@loopback/authentication'
import { repository } from '@loopback/repository'
import { param, get } from '@loopback/rest'
import { Disease, DiseaseType } from '../models'
import { DiseaseRepository } from '../repositories'
import spec from './specs/disease-type.specs'

@authenticate('jwt')
export class DiseaseDiseaseTypeController {
  constructor(
    @repository(DiseaseRepository) public diseaseRepository: DiseaseRepository
  ) {}

  @get('/api/disease/{id}/diseasetype', spec.responseOne())
  async getDiseaseType(
    @param.path.number('id') id: typeof Disease.prototype.id
  ): Promise<DiseaseType> {
    return this.diseaseRepository.diseaseType(id)
  }
}
