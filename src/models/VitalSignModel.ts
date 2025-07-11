// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Base } from '@/models'

export interface VitalSign extends Base {
  temperature: string
  systolicPressure: string
  diastolicPressure: string
  pulse: string
  breathingFrequency: string
  oxygenSaturation: string
  tall: string
  weight: string
  mass: string
  medicalRecordId?: number
}

export function createVitalSign(): VitalSign {
  return {
    id: 0,
    temperature: '',
    systolicPressure: '',
    diastolicPressure: '',
    pulse: '',
    breathingFrequency: '',
    oxygenSaturation: '',
    tall: '',
    weight: '',
    mass: ''
  }
}
