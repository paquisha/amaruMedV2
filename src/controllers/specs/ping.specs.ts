// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { OperationObject } from '@loopback/rest'

/**
 * specifications to response for ping.
 */
export function ping(): OperationObject {
  return {
    responses: {
      '200': {
        title: 'PingResponse',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                greeting: { type: 'string' },
                date: { type: 'string' }
              }
            }
          }
        }
      }
    }
  }
}

export default ping()
