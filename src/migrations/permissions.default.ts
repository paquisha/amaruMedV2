// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Permission } from '../models'
import { MEDICALSPECIALTY } from '.'
import { DISEASETYPE } from '.'
import { PERMISSION } from '.'
import { EXAMTYPE } from '.'
import { DISEASE } from '.'
import { PROFILE } from '.'
import { COMPANY } from '.'
import { OPTION } from '.'
import { MEDIC } from '.'
import { EXAM } from '.'
import { ROLE } from '.'
import { USER } from '.'

/**
 * Default permissions.
 */
const ADMIN_PERMISSIONS: Permission[] = [
  crud(COMPANY.id, { c: false }),
  crud(MEDICALSPECIALTY.id),
  crud(DISEASETYPE.id),
  crud(PERMISSION.id),
  crud(EXAMTYPE.id),
  crud(DISEASE.id),
  crud(PROFILE.id),
  crud(OPTION.id),
  crud(MEDIC.id),
  crud(USER.id),
  crud(ROLE.id),
  crud(EXAM.id)
]

function crud(
  moduleId?: number,
  config?: { c?: boolean; r?: boolean; u?: boolean; d?: boolean }
): Permission {
  return new Permission({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    moduleId,
    create: config?.c ?? true,
    read: config?.r ?? true,
    edit: config?.u ?? true,
    del: config?.d ?? true
  })
}

export const DEFAULT_PERMISSIONS: { ADMIN: Permission[] } = {
  ADMIN: ADMIN_PERMISSIONS
}
