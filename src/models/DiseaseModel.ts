// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Base } from '@/models'

export interface Disease extends Base {
  code?: string
  name: string
  description?: string
  actions?: string
  diseaseTypeId: number
}

export function createDisease(): Disease {
  return {
    id: 0,
    name: '',
    diseaseTypeId: 0
  }
}
