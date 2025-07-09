// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { responsePatchCountSchema } from './CRUDSpecs'
import { responseSimpleSchema } from './CRUDSpecs'
import { RequestBodyObject } from '@loopback/rest'
import { responseCountSchema } from './CRUDSpecs'
import { responseListSchema } from './CRUDSpecs'
import { OperationObject } from '@loopback/rest'
import { responseOneSchema } from './CRUDSpecs'
import { requestBodySchema } from './CRUDSpecs'
import { CRUDSpecScheme } from './CRUDSpecs'
import { Rpe } from '../../models'

class RpeCRUDSpecs implements CRUDSpecScheme {
  /**
   * Specifications to request a body.
   */
  requestBody(): RequestBodyObject {
    return requestBodySchema(Rpe, {
      exclude: [
        'createdAt',
        'createdBy',
        'editedAt',
        'editedBy',
        'deleted',
        'deletedAt',
        'deletedBy',
        'id'
      ],
      optional: ['medicalRecordId']
    })
  }

  /**
   * Specifications to request partial body.
   */
  requestPartialBoby(): RequestBodyObject {
    return requestBodySchema(Rpe, {
      partial: true,
      exclude: [
        'createdAt',
        'createdBy',
        'editedAt',
        'editedBy',
        'deleted',
        'deletedAt',
        'deletedBy',
        'id'
      ]
    })
  }

  /**
   * Specifications to response total of rpes.
   */
  responseCount(description?: string): OperationObject {
    return responseCountSchema(Rpe, description)
  }

  /**
   * Specifications to response one rpe.
   */
  responseOne(description?: string, includeRelations?: boolean): OperationObject {
    return responseOneSchema(
      Rpe,
      {
        includeRelations,
        exclude: []
      },
      description
    )
  }

  /**
   * Specifications to response one rpe whitout relations.
   */
  responseOneSimple(description?: string): OperationObject {
    return responseOneSchema(Rpe, undefined, description)
  }

  /**
   * Specifications to response array of rpes.
   */
  responseList(description?: string): OperationObject {
    return responseListSchema(Rpe, { includeRelations: true }, description)
  }

  /**
   * Specifications to response count of rpes updates.
   */
  responsePatchCount(description?: string): OperationObject {
    return responsePatchCountSchema(Rpe, description)
  }

  /**
   * Specifications to response 204 status.
   * @param method methods allowed PATCH, PUT, DELETE
   */
  responseSimple(
    method: 'PATCH' | 'PUT' | 'DELETE',
    description?: string
  ): OperationObject {
    return responseSimpleSchema(Rpe, method, description)
  }
}

export default new RpeCRUDSpecs()
