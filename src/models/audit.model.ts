// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Entity } from '@loopback/repository'
import { model } from '@loopback/repository'
import { integer } from './pg'
import { boolean } from './pg'
import { timestamp } from './pg'

@model()
export class Audit extends Entity {
  @timestamp({ required: true }) createdAt: string

  @integer({ required: true }) createdBy: number

  @timestamp({ default: null }) editedAt?: string

  @integer({}) editedBy?: number

  @boolean({ default: false }) deleted?: boolean

  @timestamp({ default: null }) deletedAt?: string

  @integer({}) deletedBy?: number

  constructor(data?: Partial<Audit>) {
    super(data)
  }
}
