// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Audit } from '@/services/Service'
import { patch } from '@/services/Service'
import { post } from '@/services/Service'
import { get } from '@/services/Service'
import { del } from '@/services/Service'
import { Filter } from '@/utils/query'
import { Where } from '@/utils/query'
import { Antecedent } from '@/models'

class AntecedentService {
  /**
   * Create a new antecedent record.
   * @param id patient id
   * @param antecedent antecedent to create
   */
  async create(id: number, antecedent: Partial<Antecedent>): Promise<Antecedent> {
    const res = await post(
      { url: '/api/patient/{id}/antecedent', params: { id } },
      antecedent
    )
    const data: Antecedent = res.json()
    return data
  }

  /**
   * Count antecedent records.
   * @param where search filter
   */
  async count(where?: Where<Antecedent>): Promise<number> {
    const res = await get('/api/antecedents/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search antecedent records.
   * @param filter search filter
   */
  async find(filter?: Filter<Antecedent>): Promise<Antecedent[]> {
    const res = await get('/api/antecedents', { filter: JSON.stringify(filter) })
    const data: Antecedent[] = await res.json()
    return data
  }

  /**
   * Search for a specific antecedent record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<Antecedent>): Promise<Antecedent> {
    const res = await get(
      { url: '/api/antecedent/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Antecedent = await res.json()
    return data
  }

  /**
   * Update a specific antecedent record.
   * @param id antecedent code
   * @param antecedent antecedent to update
   */
  async updateById(
    id: number,
    antecedent: Omit<Partial<Antecedent>, Audit>
  ): Promise<void> {
    await patch({ url: '/api/antecedent/{id}', params: { id } }, antecedent)
  }

  /**
   * Search for a specific antecedent record.
   * @param id patient id
   * @param filter search filter
   */
  async findByPacientId(id: number, filter?: Filter<Antecedent>): Promise<Antecedent> {
    const res = await get(
      { url: '/api/patient/{id}/antecedent', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Antecedent = await res.json()
    return data
  }

  /**
   * Delete a specific antecedent record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/antecedent/{id}', params: { id } })
  }
}
export default new AntecedentService()
