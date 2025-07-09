// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { SecuritySchemeObject } from '@loopback/openapi-v3'
import { ReferenceObject } from '@loopback/openapi-v3'

export const OPERATION_SECURITY_SPEC = [{ bearerAuth: [] }]
export type SecuritySchemeObjects = {
  [securityScheme: string]: SecuritySchemeObject | ReferenceObject
}
export const SECURITY_SCHEME_SPEC: SecuritySchemeObjects = {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  }
}
