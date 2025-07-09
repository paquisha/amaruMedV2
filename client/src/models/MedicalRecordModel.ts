// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Base } from '@/models'
import { Cros } from './CrosModel'
import { Rpe } from './RpeModel'

export interface MedicalRecord extends Base {
  reason: string
  currentIllness?: string
  done: boolean
  canceled: boolean | null
  patientId: number
  medicId: number
  readonly rpe?: Rpe
  readonly cros?: Cros
}

export function createMedicalRecord(): MedicalRecord {
  return {
    id: 0,
    reason: '',
    done: false,
    canceled: null,
    patientId: 0,
    medicId: 0
  }
}
