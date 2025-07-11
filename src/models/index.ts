// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export * from '@/models/MedicalRecordModel'
export * from '@/models/DiseaseTypeModel'
export * from '@/models/MedicalExamModel'
export * from '@/models/PermissionModel'
export * from '@/models/AntecedentModel'
export * from '@/models/DiagnosticModel'
export * from '@/models/VitalSignModel'
export * from '@/models/ExamTypeModel'
export * from '@/models/HospitalModel'
export * from '@/models/DiseaseModel'
export * from '@/models/ProfileModel'
export * from '@/models/PatientModel'
export * from '@/models/OptionModel'
export * from '@/models/ModuleModel'
export * from '@/models/MedicModel'
export * from '@/models/GroupModel'
export * from '@/models/ExamModel'
export * from '@/models/UserModel'
export * from '@/models/RoleModel'
export * from '@/models/CrosModel'
export * from '@/models/RpeModel'

export interface Base {
  createdAt?: string
  createdBy?: number
  deleted?: boolean
  editedAt?: string
  editedBy?: number
  deletedAt?: string
  deletedBy?: number
  id: number
}
