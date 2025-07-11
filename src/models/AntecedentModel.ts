// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Base } from '@/models'

export interface Antecedent extends Base {
  personal?: string
  surgical?: string
  family?: string
  professional?: string
  habits?: string
  clinician?: string
  trauma?: string
  allergy?: string
  ago?: string
  patientId: number
}

export function createAntecedent(): Antecedent {
  return {
    id: 0,
    patientId: 0
  }
}
