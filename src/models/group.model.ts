// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Entity } from '@loopback/repository'
import { model } from '@loopback/repository'
import { id } from './pg'
import { character } from './pg'

@model({ name: 'tgroup' })
export class Group extends Entity {
  @id({ serial: false }) id: number

  @character({ length: 30, required: true }) name: string

  constructor(data?: Partial<Group>) {
    super(data)
  }
}

export interface GroupRelations {
  // describe navigational properties here
}

export type GroupWithRelations = Group & GroupRelations
