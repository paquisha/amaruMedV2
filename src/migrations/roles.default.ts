// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Role } from '../models'

export const DEFAULT_ADMIN_ROLE: Role = new Role({
  createdAt: new Date().toLocaleString(),
  createdBy: 0,
  name: 'Administración',
  description: 'Usuario de administración'
})

/**
 * Default roles.
 */
export const ROLES: Role[] = [DEFAULT_ADMIN_ROLE]
