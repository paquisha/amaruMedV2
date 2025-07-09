// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { CRUDSpecScheme } from './CRUDSpecs'
import { responseCountSchema } from './CRUDSpecs'
import { responseSimpleSchema } from './CRUDSpecs'
import { requestBodySchema } from './CRUDSpecs'
import { responseOneSchema } from './CRUDSpecs'
import { responsePatchCountSchema } from './CRUDSpecs'
import { responseListSchema } from './CRUDSpecs'
import { Permission } from '../../models'

class PermissionCRUDSpecs implements CRUDSpecScheme {
  /**
   * Specifications to request a body.
   */
  requestBody(): RequestBodyObject {
    return requestBodySchema(Permission, {
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
   * Specifications to request partial body.
   */
  requestPartialBoby(): RequestBodyObject {
    return requestBodySchema(Permission, {
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
   * Specifications to response total of permissions.
   */
  responseCount(description?: string): OperationObject {
    return responseCountSchema(Permission, description)
  }

  /**
   * Specifications to response one permission.
   */
  responseOne(description?: string): OperationObject {
    return responseOneSchema(
      Permission,
      {
        includeRelations: true,
        exclude: []
      },
      description
    )
  }

  /**
   * Specifications to response array of permissions.
   */
  responseList(description?: string): OperationObject {
    return responseListSchema(Permission, { includeRelations: true }, description)
  }

  /**
   * Specifications to response count of permissions updates.
   */
  responsePatchCount(description?: string): OperationObject {
    return responsePatchCountSchema(Permission, description)
  }

  /**
   * Specifications to response 204 status.
   * @param method methods allowed PATCH, PUT, DELETE
   */
  responseSimple(
    method: 'PATCH' | 'PUT' | 'DELETE',
    description?: string
  ): OperationObject {
    return responseSimpleSchema(Permission, method, description)
  }
}

export default new PermissionCRUDSpecs()
