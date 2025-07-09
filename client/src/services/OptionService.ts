// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Audit } from '@/services/Service'
import { Crud } from '@/services/Service'
import { patch } from '@/services/Service'
import { post } from '@/services/Service'
import { get } from '@/services/Service'
import { del } from '@/services/Service'
import { Filter } from '@/utils/query'
import { Where } from '@/utils/query'
import { Option } from '@/models'

class OptionService implements Crud<Option> {
  /**
   * Create a new option record.
   * @param option option to create
   */
  async create(option: Omit<Partial<Option>, Audit>): Promise<Option> {
    const res = await post('/api/option', option)
    const data: Option = res.json()
    return data
  }

  /**
   * Count option records.
   * @param where search filter
   */
  async count(where?: Where<Option>): Promise<number> {
    const res = await get('/api/options/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search option records.
   * @param filter search filter
   */
  async find(filter?: Filter<Option>): Promise<Option[]> {
    const res = await get('/api/options', { filter: JSON.stringify(filter) })
    const data: Option[] = await res.json()
    return data
  }

  /**
   * Search for a specific option record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<Option>): Promise<Option> {
    const res = await get(
      { url: '/api/option/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Option = await res.json()
    return data
  }

  /**
   * Update a specific option record.
   * @param id registration code
   * @param option option to update
   */
  async updateById(id: number, option: Omit<Partial<Option>, Audit>): Promise<void> {
    await patch({ url: '/api/option/{id}', params: { id } }, option)
  }

  /**
   * Delete a specific option record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/option/{id}', params: { id } })
  }
}
export default new OptionService()
