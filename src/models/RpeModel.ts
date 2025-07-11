// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Base } from '@/models'

export interface Rpe extends Base {
  head?: boolean
  neck?: boolean
  chest?: boolean
  abdomen?: boolean
  pelvis?: boolean
  extremities?: boolean
  observations?: string
}

export function createRpe(): Rpe {
  return {
    id: 0
  }
}
