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
import { Medic } from '@/models'

class MedicService {
  /**
   * Create a new medic record.
   * @param medic medic to create
   */
  async create(id: number, medic: Omit<Partial<Medic>, Audit>): Promise<Medic> {
    const res = await post({ url: '/api/user/{id}/medic', params: { id } }, medic)
    const data: Medic = res.json()
    return data
  }

  /**
   * Count medic records.
   * @param where search filter
   */
  async count(where?: Where<Medic>): Promise<number> {
    const res = await get('/api/medics/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search medic records.
   * @param filter search filter
   */
  async find(filter?: Filter<Medic>): Promise<Medic[]> {
    const res = await get('/api/medics', { filter: JSON.stringify(filter) })
    const data: Medic[] = await res.json()
    return data
  }

  /**
   * Search for a specific medic record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<Medic>): Promise<Medic> {
    const res = await get(
      { url: '/api/medic/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Medic = await res.json()
    return data
  }

  /**
   * Search for a  medic record by user id.
   * @param id user id
   * @param filter search filter
   */
  async findByUserId(id: number, filter?: Filter<Medic>): Promise<Medic> {
    const res = await get(
      { url: '/api/user/{id}/medic', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Medic = await res.json()
    return data
  }

  /**
   * Update a specific medic record.
   * @param id registration code
   * @param medic medic to update
   */
  async updateById(id: number, medic: Omit<Partial<Medic>, Audit>): Promise<void> {
    await patch({ url: '/api/medic/{id}', params: { id } }, medic)
  }

  /**
   * Delete a specific medic record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/medic/{id}', params: { id } })
  }
}
export default new MedicService()
