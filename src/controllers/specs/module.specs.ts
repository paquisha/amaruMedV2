// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { OperationObject } from '@loopback/rest'
import { responseListSchema, responseOneSchema } from './CRUDSpecs'
import { Module } from '../../models'

class ModuleSpecs {
  responseList(description?: string): OperationObject {
    return responseListSchema(Module, undefined, description)
  }

  responseOne(description?: string): OperationObject {
    return responseOneSchema(Module, undefined, description)
  }
}

export default new ModuleSpecs()
