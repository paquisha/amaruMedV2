// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { property } from '@loopback/repository'

/**
 * Identification code.
 * @param definition
 */
export function id(definition: { serial?: boolean } = { serial: true }) {
  return property({
    type: 'number',
    id: true,
    generated: definition.serial
  })
}

/**
 * Postgres native `character varying`.
 * @param definition
 */
export function character(definition: {
  length: number
  required?: boolean
  columnName?: string
}) {
  return property({
    type: 'string',
    required: definition.required,
    length: definition.length,
    postgresql: {
      columnName: definition.columnName,
      dataType: 'character varying',
      dataLength: definition.length
    }
  })
}

/**
 * Postgres native `text`.
 * @param definition
 */
export function text(definition?: { required?: boolean; columnName?: string }) {
  return property({
    type: 'string',
    required: definition?.required,
    postgresql: {
      columnName: definition?.columnName,
      dataType: 'text'
    }
  })
}

/**
 * Postgres native `integer`.
 * @param definition
 */
export function integer(definition?: { required?: boolean; columnName?: string }) {
  return property({
    type: 'number',
    required: definition?.required,
    postgresql: {
      columnName: definition?.columnName,
      dataType: 'integer'
    }
  })
}

/**
 * Postgres native `boolean`.
 */
export function boolean(definition?: {
  default?: boolean
  required?: boolean
  columnName?: string
}) {
  return property({
    type: 'boolean',
    required: definition?.required,
    default: definition?.default,
    postgresql: {
      columnName: definition?.columnName,
      dataType: 'boolean'
    }
  })
}

/**
 * Postgres native `TIMESTAMP`.
 */
export function timestamp(definition?: {
  default?: Date | string | null
  required?: boolean
  columnName?: string
}) {
  return property({
    type: 'date',
    required: definition?.required,
    default: definition?.default ?? null,
    postgresql: {
      columnName: definition?.columnName,
      dataType: 'TIMESTAMP WITH TIME ZONE'
    }
  })
}

/**
 * Postgres native `DATE`.
 */
export function date(definition?: {
  default?: Date | string | null
  required?: boolean
  columnName?: string
}) {
  return property({
    type: 'date',
    required: definition?.required,
    default: definition?.default ?? null,
    postgresql: {
      columnName: definition?.columnName,
      dataType: 'DATE'
    }
  })
}

/**
 * Domain to `email`.
 * @param definition
 */
export function email(definition?: { required?: boolean; columnName?: string }) {
  return character({
    length: 50,
    required: definition?.required,
    columnName: definition?.columnName
  })
}

/**
 * Domain to `filename`.
 * @param definition
 */
export function filename(definition?: { required?: boolean; columnName?: string }) {
  return character({
    length: 75,
    required: definition?.required,
    columnName: definition?.columnName
  })
}

/**
 * Domain to `phone number`.
 * @param definition
 */
export function phone(definition?: { required?: boolean; columnName?: string }) {
  return character({
    length: 13,
    required: definition?.required,
    columnName: definition?.columnName
  })
}

/**
 * Domain to `dni`.
 * @param definition
 */
export function dni(definition?: { required?: boolean; columnName?: string }) {
  return character({
    length: 10,
    required: definition?.required,
    columnName: definition?.columnName
  })
}

/**
 * Domain to `passport`.
 * @param definition
 */
export function passport(definition?: { required?: boolean; columnName?: string }) {
  return character({
    length: 13,
    required: definition?.required,
    columnName: definition?.columnName
  })
}

/**
 * Domain to `address`.
 * @param definition
 */
export function address(definition?: { required?: boolean; columnName?: string }) {
  return character({
    length: 100,
    required: definition?.required,
    columnName: definition?.columnName
  })
}

/**
 * Domain to `option`.
 * @param definition
 */
export function option(definition: { required?: boolean; columnName?: string }) {
  return character({
    length: 50,
    required: definition.required,
    columnName: definition.columnName
  })
}
