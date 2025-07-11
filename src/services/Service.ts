// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { ResourceMethods } from 'vue-resource/types/vue_resource'
import { AnyObject } from '@/utils/query'
import { Filter } from '@/utils/query'
import { Where } from '@/utils/query'
//@ts-ignore
import { Resource } from 'vue-resource'

interface UrlOptions {
  url: string
  params: object
}

/**
 * Send GET request.
 * @param url
 * @param query
 */
export async function get(url: UrlOptions | string, query?: object) {
  const rsc: ResourceMethods = Resource(typeof url === 'string' ? url : url.url, query)
  return rsc.get(typeof url === 'string' ? undefined : url.params)
}

/**
 * Send POST request.
 * @param url
 * @param data
 * @param query
 */
export async function post(url: UrlOptions | string, data?: object, query?: object) {
  const rsc: ResourceMethods = Resource(typeof url === 'string' ? url : url.url, query)
  return rsc.save(typeof url === 'string' ? undefined : url.params, formatData(data))
}

/**
 * Send PUT request.
 * @param url
 * @param data
 * @param query
 */
export async function put(url: UrlOptions | string, data?: object, query?: object) {
  const rsc: ResourceMethods = Resource(typeof url === 'string' ? url : url.url, query)
  return rsc.update(typeof url === 'string' ? undefined : url.params, formatData(data))
}

/**
 * Send PATCH request.
 * @param url
 * @param data
 * @param query
 */
export async function patch(url: UrlOptions | string, data?: any, query?: object) {
  const rsc: ResourceMethods = Resource(typeof url === 'string' ? url : url.url, query, {
    patch: { method: 'PATCH' }
  })
  //@ts-ignore
  return rsc.patch(typeof url === 'string' ? undefined : url.params, formatData(data))
}

/**
 * Send DELETE request.
 * @param url
 */
export function del(url: UrlOptions | string) {
  const rsc: ResourceMethods = Resource(typeof url === 'string' ? url : url.url)
  return rsc.delete(typeof url === 'string' ? undefined : url.params)
}

export type Audit =
  | 'id'
  | 'createdAt'
  | 'createdBy'
  | 'editedAt'
  | 'editedBy'
  | 'deleted'
  | 'deletedAt'
  | 'deletedBy'

/**
 * Interface for a crud service.
 */
export interface Crud<E extends AnyObject> {
  create(element: Omit<Partial<E>, Audit>): Promise<E>
  count(where?: Where<E>): Promise<number>
  find(filter?: Filter<E>): Promise<E[]>
  findById(id: number, filter?: Filter<E>): Promise<E>
  updateById(id: number, element: Omit<Partial<E>, Audit>): Promise<void>
  delete(id: number): Promise<void>
}

/**
 * Format null or empty data of an http request body.
 * @param model model to format
 */
function formatData(model: any): object {
  const keys = Object.keys(model)
  keys.forEach(item => {
    if (
      model[item] === undefined ||
      model[item] === null ||
      model[item] === '' ||
      model[item] === 0
    )
      model[item] = undefined
  })
  return model
}
