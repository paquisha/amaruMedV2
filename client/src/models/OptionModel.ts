// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Base } from '@/models'
import { Group } from '@/models'

export interface Option extends Base {
  name: string
  groupId: number
  group?: Group
}

export function createOption(): Option {
  return {
    id: 0,
    name: '',
    groupId: 0
  }
}
