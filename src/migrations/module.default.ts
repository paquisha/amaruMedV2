// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Module } from '../models'

export const MEDICALRECORD: Module = new Module({ id: 1, name: 'medicalrecords' })
export const DISEASETYPE: Module = new Module({ id: 2, name: 'diseasetypes' })
export const MEDICALEXAM: Module = new Module({ id: 3, name: 'medicalexams' })
export const SPECIALIST: Module = new Module({ id: 4, name: 'specialists' })
export const DIAGNOSTIC: Module = new Module({ id: 5, name: 'diagnostics' })
export const ANTECEDENT: Module = new Module({ id: 6, name: 'antecedents' })
export const PERMISSION: Module = new Module({ id: 7, name: 'permissions' })
export const VITALSIGN: Module = new Module({ id: 8, name: 'vitalsigns' })
export const EXAMTYPE: Module = new Module({ id: 9, name: 'examtypes' })
export const PROFILE: Module = new Module({ id: 10, name: 'profiles' })
export const DISEASE: Module = new Module({ id: 11, name: 'diseases' })
export const PATIENT: Module = new Module({ id: 12, name: 'patients' })
export const COMPANY: Module = new Module({ id: 13, name: 'company' })
export const MODULE: Module = new Module({ id: 14, name: 'modules' })
export const OPTION: Module = new Module({ id: 15, name: 'options' })
export const MEDIC: Module = new Module({ id: 16, name: 'medics' })
export const EXAM: Module = new Module({ id: 17, name: 'exams' })
export const USER: Module = new Module({ id: 18, name: 'users' })
export const ROLE: Module = new Module({ id: 19, name: 'roles' })
export const CORS: Module = new Module({ id: 20, name: 'cors' })
export const RPE: Module = new Module({ id: 21, name: 'rpe' })

export const MEDICALSPECIALTY: Module = new Module({
  id: 22,
  name: 'medicalspecialties'
})

/**
 * Default modules.
 */
export const MODULES: Module[] = [
  MEDICALSPECIALTY,
  MEDICALRECORD,
  MEDICALEXAM,
  DISEASETYPE,
  PERMISSION,
  DIAGNOSTIC,
  SPECIALIST,
  ANTECEDENT,
  VITALSIGN,
  EXAMTYPE,
  COMPANY,
  PATIENT,
  DISEASE,
  PROFILE,
  MODULE,
  OPTION,
  MEDIC,
  USER,
  CORS,
  ROLE,
  EXAM,
  RPE
]
