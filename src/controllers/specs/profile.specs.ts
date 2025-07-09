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
import { Profile } from '../../models'

class ProfileCRUDSpecs implements CRUDSpecScheme {
  /**
   * Specifications to request a body.
   */
  requestBody(): RequestBodyObject {
    return requestBodySchema(Profile, {
      exclude: [
        'createdAt',
        'createdBy',
        'editedAt',
        'editedBy',
        'deleted',
        'deletedAt',
        'deletedBy',
        'id',
        'image'
      ]
    })
  }

  /**
   * Specifications to request partial body.
   */
  requestPartialBoby(): RequestBodyObject {
    return requestBodySchema(Profile, {
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
   * Specifications to response total of profiles.
   */
  responseCount(description?: string): OperationObject {
    return responseCountSchema(Profile, description)
  }

  /**
   * Specifications to response one profile.
   */
  responseOne(description?: string): OperationObject {
    return responseOneSchema(
      Profile,
      {
        includeRelations: true,
        exclude: []
      },
      description
    )
  }

  /**
   * Specifications to response array of profiles.
   */
  responseList(description?: string): OperationObject {
    return responseListSchema(Profile, { includeRelations: true }, description)
  }

  /**
   * Specifications to response count of profiles updates.
   */
  responsePatchCount(description?: string): OperationObject {
    return responsePatchCountSchema(Profile, description)
  }

  /**
   * Specifications to response 204 status.
   * @param method methods allowed PATCH, PUT, DELETE
   */
  responseSimple(
    method: 'PATCH' | 'PUT' | 'DELETE',
    description?: string
  ): OperationObject {
    return responseSimpleSchema(Profile, method, description)
  }
}

export default new ProfileCRUDSpecs()
