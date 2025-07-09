// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { OperationObject } from '@loopback/rest'
import { responseListSchema } from './CRUDSpecs'
import { responseOneSchema } from './CRUDSpecs'
import { Group } from '../../models'

class GroupSpect {
  responseList(description?: string): OperationObject {
    return responseListSchema(Group, undefined, description)
  }

  responseOne(description?: string): OperationObject {
    return responseOneSchema(Group, undefined, description)
  }
}

export default new GroupSpect()
