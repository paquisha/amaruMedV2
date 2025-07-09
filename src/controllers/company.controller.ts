// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { authenticate } from '@loopback/authentication'
import { repository } from '@loopback/repository'
import { requestBody } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { get } from '@loopback/rest'
import { CompanyRepository } from '../repositories'
import spec from './specs/company.specs'
import { Company } from '../models'

@authenticate('jwt')
export class CompanyController {
  constructor(@repository(CompanyRepository) public companyRepo: CompanyRepository) {}

  @get('/api/company', spec.responseOne())
  async findById(): Promise<Company> {
    return this.companyRepo.findById(1)
  }

  @patch('/api/company', spec.responseSimple('PATCH'))
  async updateById(
    @requestBody(spec.requestPartialBoby()) company: Company
  ): Promise<void> {
    await this.companyRepo.updateById(1, company)
  }
}
