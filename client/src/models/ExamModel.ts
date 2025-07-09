// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Base } from '@/models'

export interface Exam extends Base {
  name: string
  examTypeId: number
}

export function createExam(): Exam {
  return {
    id: 0,
    name: '',
    examTypeId: 0
  }
}
