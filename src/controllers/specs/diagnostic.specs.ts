// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { responsePatchCountSchema } from './CRUDSpecs'
import { getModelSchemaRef } from '@loopback/rest'
import { responseSimpleSchema } from './CRUDSpecs'
import { RequestBodyObject } from '@loopback/rest'
import { responseCountSchema } from './CRUDSpecs'
import { OperationObject } from '@loopback/rest'
import { responseListSchema } from './CRUDSpecs'
import { responseOneSchema } from './CRUDSpecs'
import { requestBodySchema } from './CRUDSpecs'
import { CRUDSpecScheme } from './CRUDSpecs'
import { Diagnostic } from '../../models'

class DiagnosticCRUDSpecs implements CRUDSpecScheme {
  /**
   * Specifications to request a body.
   */
  requestBody(): RequestBodyObject {
    return {
      content: {
        'application/json': {
          schema: {
            type: 'array',
            description: 'disease id',
            items: getModelSchemaRef(Diagnostic, {
              exclude: [
                'createdAt',
                'createdBy',
                'editedAt',
                'editedBy',
                'deleted',
                'deletedAt',
                'deletedBy',
                'id',
                'medicalRecordId'
              ]
            })
          }
        }
      }
    }
  }

  /**
   * Specifications to request partial body.
   */
  requestPartialBoby(): RequestBodyObject {
    return requestBodySchema(Diagnostic, {
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
   * Specifications to response total of diagnostics.
   */
  responseCount(description?: string): OperationObject {
    return responseCountSchema(Diagnostic, description)
  }

  /**
   * Specifications to response one diagnostic.
   */
  responseOne(description?: string, includeRelations?: boolean): OperationObject {
    return responseOneSchema(
      Diagnostic,
      {
        includeRelations,
        exclude: []
      },
      description
    )
  }

  /**
   * Specifications to response one diagnostic whitout relations.
   */
  responseOneSimple(description?: string): OperationObject {
    return responseOneSchema(Diagnostic, undefined, description)
  }

  /**
   * Specifications to response array of diagnostics.
   */
  responseList(description?: string): OperationObject {
    return responseListSchema(Diagnostic, { includeRelations: true }, description)
  }

  /**
   * Specifications to response count of diagnostics updates.
   */
  responsePatchCount(description?: string): OperationObject {
    return responsePatchCountSchema(Diagnostic, description)
  }

  /**
   * Specifications to response 204 status.
   * @param method methods allowed PATCH, PUT, DELETE
   */
  responseSimple(
    method: 'PATCH' | 'PUT' | 'DELETE',
    description?: string
  ): OperationObject {
    return responseSimpleSchema(Diagnostic, method, description)
  }
}

export default new DiagnosticCRUDSpecs()
