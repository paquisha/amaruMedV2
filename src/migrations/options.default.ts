// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Option } from '../models'
import { SEX } from '.'
import { BLOODTYPE } from '.'
import { CIVILSTATUS } from '.'

/**
 * Default options.
 */
export const OPTIONS: Option[] = [
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: BLOODTYPE.id,
    name: ' A -'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: BLOODTYPE.id,
    name: ' A +'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: BLOODTYPE.id,
    name: 'AB -'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: BLOODTYPE.id,
    name: 'AB +'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: BLOODTYPE.id,
    name: ' B -'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: BLOODTYPE.id,
    name: ' B +'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: BLOODTYPE.id,
    name: ' O -'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: BLOODTYPE.id,
    name: ' O +'
  }),

  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: CIVILSTATUS.id,
    name: 'Soltero/a'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: CIVILSTATUS.id,
    name: 'Casado/a'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: CIVILSTATUS.id,
    name: 'Divorciado/a'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: CIVILSTATUS.id,
    name: 'Viudo/a'
  }),

  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: SEX.id,
    name: 'Masculino'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: SEX.id,
    name: 'Femenino'
  }),
  new Option({
    createdAt: new Date().toLocaleString(),
    createdBy: 0,
    groupId: SEX.id,
    name: 'Otro'
  })
]
