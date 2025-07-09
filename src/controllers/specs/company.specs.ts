// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { RequestBodyObject } from '@loopback/rest'
import { OperationObject } from '@loopback/rest'
import { responseSimpleSchema } from './CRUDSpecs'
import { responseOneSchema } from './CRUDSpecs'
import { requestBodySchema } from './CRUDSpecs'
import { Company } from '../../models'

class CompanySpecs {
  requestPartialBoby(): RequestBodyObject {
    return requestBodySchema(Company, { partial: true })
  }

  responseOne(description?: string): OperationObject {
    return responseOneSchema(Company, undefined, description)
  }

  responseSimple(
    method: 'PATCH' | 'PUT' | 'DELETE',
    description?: string
  ): OperationObject {
    return responseSimpleSchema(Company, method, description)
  }
}

export default new CompanySpecs()
