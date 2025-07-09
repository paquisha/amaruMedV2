// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { OperationObject } from '@loopback/rest'
import { OPERATION_SECURITY_SPEC } from '../../auth'

/**
 * specifications to response for log info.
 */
export function log(): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        title: 'Application',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                createdBy: {
                  type: 'object',
                  properties: {
                    user: { type: 'string' },
                    image: { type: 'string' }
                  }
                },
                editedBy: {
                  type: 'object',
                  properties: {
                    user: { type: 'string' },
                    image: { type: 'string' }
                  }
                },
                deletedBy: {
                  type: 'object',
                  properties: {
                    user: { type: 'string' },
                    image: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

export default log()
