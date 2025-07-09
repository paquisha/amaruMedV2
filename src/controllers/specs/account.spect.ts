// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { OPERATION_SECURITY_SPEC } from '../../auth'
import { OperationObject } from '@loopback/rest'
import { getModelSchemaRef } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { responseAuthNoContentSchema } from './CRUDSpecs'
import { Profile, User, Role } from '../../models'

/**
 * specifications to response the access token.
 */
export function logged(): OperationObject {
  return {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                },
                expiresAt: {
                  type: 'number'
                }
              }
            }
          }
        }
      }
    }
  }
}

/**
 * specifications to response to restore password.
 */
export function responseRestorePass(): OperationObject {
  return responseAuthNoContentSchema("Restore a user's password")
}

/**
 * specifications to response  an deleted account .
 */
export function responseDelete(): OperationObject {
  return responseAuthNoContentSchema('Delete an account')
}

/**
 * specifications in response to update one password per session.
 */
export function responseUpdateMePass(): OperationObject {
  return responseAuthNoContentSchema('Update the password of the user who logged')
}

/**
 * Specifications to request login
 */
export function login(): RequestBodyObject {
  return {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email'
            },
            password: {
              type: 'string',
              minLength: 8
            }
          }
        }
      }
    }
  }
}

/**
 * Specifications to change a password.
 */
export function toChangePassword(): RequestBodyObject {
  return {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['password'],
          properties: {
            password: {
              type: 'string',
              minLength: 8,
              description: 'current password'
            }
          }
        }
      }
    }
  }
}

/**
 * Specifications for changing a password for a logged account.
 */
export function toUpdateMyPassword(): RequestBodyObject {
  return {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['newPassword', 'currentPassword'],
          properties: {
            newPassword: {
              type: 'string',
              minLength: 8
            },
            currentPassword: {
              type: 'string',
              minLength: 8
            }
          }
        }
      }
    }
  }
}

/**
 * Specifications to request login
 */
export function toActivate(): RequestBodyObject {
  return {
    required: true,
    content: {
      'application/json': {
        schema: {
          type: 'object',
          required: ['token', 'password'],
          properties: {
            token: {
              type: 'string'
            },
            password: {
              type: 'string',
              minLength: 8
            }
          }
        }
      }
    }
  }
}

/**
 * specifications to response information about logged account
 */
export function me(): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: 'User model instance',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user: getModelSchemaRef(User, {
                  exclude: [
                    'createdAt',
                    'createdBy',
                    'editedAt',
                    'editedBy',
                    'deleted',
                    'deletedAt',
                    'deletedBy',
                    'password',
                    'emailVerified',
                    'passResetToken'
                  ]
                }),
                role: getModelSchemaRef(Role, {
                  exclude: [
                    'createdAt',
                    'createdBy',
                    'editedAt',
                    'editedBy',
                    'deleted',
                    'deletedAt',
                    'deletedBy'
                  ]
                }),
                profile: getModelSchemaRef(Profile, {
                  exclude: [
                    'createdAt',
                    'createdBy',
                    'editedAt',
                    'editedBy',
                    'deleted',
                    'deletedAt',
                    'deletedBy'
                  ]
                }),
                isMedic: { type: 'boolean' },
                medic: getModelSchemaRef(Profile, {
                  exclude: [
                    'createdAt',
                    'createdBy',
                    'editedAt',
                    'editedBy',
                    'deleted',
                    'deletedAt',
                    'deletedBy'
                  ]
                })
              }
            }
          }
        }
      }
    }
  }
}
