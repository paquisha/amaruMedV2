// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/**
 * Objects with open properties
 */
export interface AnyObject {
  // eslint-disable-next-line
  [property: string]: any
}

/**
 * Operators for where clauses
 */
export declare type Operators =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'inq'
  | 'nin'
  | 'between'
  | 'exists'
  | 'and'
  | 'or'
  | 'like'
  | 'nlike'
  | 'ilike'
  | 'nilike'
  | 'regexp'

/**
 * Key types of a given model, excluding operators
 */
export declare type KeyOf<MT extends object> = Exclude<
  Extract<keyof MT, string>,
  Operators
>

/**
 * Matching predicate comparison
 */
export declare type PredicateComparison<PT> = {
  eq?: PT
  neq?: PT
  gt?: PT
  gte?: PT
  lt?: PT
  lte?: PT
  inq?: PT[]
  nin?: PT[]
  between?: [PT, PT]
  exists?: boolean
  like?: PT
  nlike?: PT
  ilike?: PT
  nilike?: PT
  regexp?: string | RegExp
}

/**
 * Value types for `{propertyName: value}`
 */
export declare type ShortHandEqualType = string | number | boolean | Date

/**
 * Condition clause
 *
 * @example
 * ```ts
 * {
 *   name: {inq: ['John', 'Mary']},
 *   status: 'ACTIVE',
 *   age: {gte: 40}
 * }
 * ```
 */
export declare type Condition<MT extends object> = {
  [P in KeyOf<MT>]?: PredicateComparison<MT[P]> | (MT[P] & ShortHandEqualType)
}

/**
 * And clause
 *
 * @example
 * ```ts
 * {
 *   and: [...],
 * }
 * ```
 */
export interface AndClause<MT extends object> {
  and: Where<MT>[]
}
/**
 * Or clause
 *
 * @example
 * ```ts
 * {
 *   or: [...],
 * }
 * ```
 */
export interface OrClause<MT extends object> {
  or: Where<MT>[]
}

/**
 * Where clause
 *
 * @example
 * ```ts
 * {
 *   name: {inq: ['John', 'Mary']},
 *   status: 'ACTIVE'
 *   and: [...],
 *   or: [...],
 * }
 * ```
 */
export declare type Where<MT extends object = AnyObject> =
  | Condition<MT>
  | AndClause<MT>
  | OrClause<MT>

/**
 * Selection of fields
 *
 * Example:
 * `{afieldname: true}`
 */
export declare type Fields<MT = AnyObject> = {
  [P in keyof MT]?: boolean
}
/**
 * Inclusion of related items
 *
 * Note: scope means filter on related items
 *
 * Example:
 * `{relation: 'aRelationName', scope: {<AFilterObject>}}`
 */
export interface Inclusion {
  relation: string
  scope?: Filter<AnyObject>
}
/**
 * Query filter object
 */
export interface Filter<MT extends object = AnyObject> {
  /**
   * The matching criteria
   */
  where?: Where<MT>
  /**
   * To include/exclude fields
   */
  fields?: Fields<MT>
  /**
   * Sorting order for matched entities. Each item should be formatted as
   * `fieldName ASC` or `fieldName DESC`.
   * For example: `['f1 ASC', 'f2 DESC', 'f3 ASC']`.
   *
   * We might want to use `Order` in the future. Keep it as `string[]` for now
   * for compatibility with LoopBack 3.x.
   */
  order?: string[]
  /**
   * Maximum number of entities
   */
  limit?: number
  /**
   * Skip N number of entities
   */
  skip?: number
  /**
   * Offset N number of entities. An alias for `skip`
   */
  offset?: number
  /**
   * To include related objects
   */
  include?: Inclusion[]
}
