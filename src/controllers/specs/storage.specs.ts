// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { OperationObject } from '@loopback/rest'
import { OPERATION_SECURITY_SPEC } from '../../auth'

/**
 * specifications to response the file url.
 */
export function responseOneUrl(): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      200: {
        content: {
          'application/json': {
            schema: {
              properties: {
                url: { type: 'string' }
              }
            }
          }
        },
        description: 'Image uploaded'
      }
    }
  }
}

export function responseDeleted(): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {}
    }
  }
}
