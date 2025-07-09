// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Group } from '../models'

export const BLOODTYPE: Group = new Group({ id: 1, name: 'Tipo de sangre' })
export const CIVILSTATUS: Group = new Group({ id: 2, name: 'Estado civil' })
export const SEX: Group = new Group({ id: 3, name: 'Sexo' })

/**
 * Default groups.
 */
export const GROUPS: Group[] = [BLOODTYPE, CIVILSTATUS, SEX]
