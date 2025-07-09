// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { OperationObject } from '@loopback/rest'
import { getModelSchemaRef } from '@loopback/rest'
import { JsonSchemaOptions } from '@loopback/rest'
import { RequestBodyObject } from '@loopback/rest'
import { OPERATION_SECURITY_SPEC } from '../../auth'
import { CountSchema } from '@loopback/repository'

export function requestBodySchema<M extends object>(
  model: Function & { prototype: M },
  options?: JsonSchemaOptions<M>
): RequestBodyObject {
  return {
    content: {
      'application/json': {
        schema: getModelSchemaRef(model, options)
      }
    }
  }
}

export function responseCountSchema<M extends object>(
  model: Function & { prototype: M },
  description?: string
): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: description ?? `${model.name} model count.`,
        content: { 'application/json': { schema: CountSchema } }
      }
    }
  }
}

export function responseOneSchema<M extends object>(
  model: Function & { prototype: M },
  options?: JsonSchemaOptions<M>,
  description?: string
): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: description ?? `${model.name} model instance`,
        content: {
          'application/json': { schema: getModelSchemaRef(model, options) }
        }
      }
    }
  }
}

export function responsePatchCountSchema<M extends object>(
  model: Function & { prototype: M },
  description?: string
): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: description ?? `${model.name} PATCH success count`,
        content: { 'application/json': { schema: CountSchema } }
      }
    }
  }
}

export function responseDeleteCountSchema(
  model: string,
  description?: string
): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: description ?? `${model} DELETE success count`,
        content: { 'application/json': { schema: CountSchema } }
      }
    }
  }
}

export function responseListSchema<M extends object>(
  model: Function & { prototype: M },
  options?: JsonSchemaOptions<M>,
  description?: string
): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '200': {
        description: description ?? `Array of ${model.name} model instances`,
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(model, options)
            }
          }
        }
      }
    }
  }
}

export function responseSimpleSchema<M extends object>(
  model: Function & { prototype: M },
  method: 'PATCH' | 'PUT' | 'DELETE',
  description?: string
): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: description ?? `${model.name} ${method} success`
      }
    }
  }
}

export function responseAuthNoContentSchema(description?: string): OperationObject {
  return {
    security: OPERATION_SECURITY_SPEC,
    responses: {
      '204': {
        description: description
      }
    }
  }
}

export function responseNoContentSchema(description?: string): OperationObject {
  return {
    responses: {
      '204': {
        description: description
      }
    }
  }
}

export interface CRUDSpecScheme {
  requestBody(): RequestBodyObject
  requestPartialBoby(): RequestBodyObject

  responseCount(description?: string): OperationObject
  responseOne(description?: string, includeRelations?: boolean): OperationObject
  responseList(description?: string): OperationObject
  responsePatchCount(description?: string): OperationObject
  responseSimple(
    method: 'PATCH' | 'PUT' | 'DELETE',
    description?: string
  ): OperationObject
}
