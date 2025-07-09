// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { OperationObject } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { OPERATION_SECURITY_SPEC } from '../../auth'
export { responseNoContentSchema as noContent } from './CRUDSpecs'
/**
 * specifications to response.
 */
export function response(): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {}
    }
  }
}

/**
 * Specifications to request a welcome email
 */
export function email(): RequestBodyObject {
  return {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            }
          }
        }
      }
    }
  }
}
