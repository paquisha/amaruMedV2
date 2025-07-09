// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Profile } from '../models'
import { User } from '../models'

/**
 * Administrator user profile.
 */
export const DEFAULT_PROFILE: Profile = new Profile({
  createdAt: new Date().toLocaleString(),
  createdBy: 0,
  firstName: 'admin',
  lastName: 'amarumed',
  email: 'paquishaxd@gmail.com',
  address: 'my address'
})

/**
 * Default Administrator user.
 */
export const DEFAULT_ADMIN: User = new User({
  createdAt: new Date().toLocaleString(),
  createdBy: 0,
  email: DEFAULT_PROFILE.email,
  password: 'Chamber4Aime1',
  isActive: true,
  emailVerified: true
})
