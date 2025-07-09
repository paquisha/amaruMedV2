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
import { VitalSign } from '@/models'

class VitalSignService {
  /**
   * Create a new vital sign record.
   * @param id medical record id
   * @param vitalSign vital sign to create
   */
  async create(
    id: number,
    vitalSign: Omit<Partial<VitalSign>, Audit>
  ): Promise<VitalSign> {
    const res = await post(
      { url: '/api/medicalrecord/{id}/vitalsign', params: { id } },
      vitalSign
    )
    const data: VitalSign = res.json()
    return data
  }

  /**
   * Count vital sign records.
   * @param where search filter
   */
  async count(where?: Where<VitalSign>): Promise<number> {
    const res = await get('/api/vitalsigns/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search vital sign records.
   * @param filter search filter
   */
  async find(filter?: Filter<VitalSign>): Promise<VitalSign[]> {
    const res = await get('/api/vitalsigns', { filter: JSON.stringify(filter) })
    const data: VitalSign[] = await res.json()
    return data
  }

  /**
   * Search for a specific vital sign record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<VitalSign>): Promise<VitalSign> {
    const res = await get(
      { url: '/api/vitalsign/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: VitalSign = await res.json()
    return data
  }

  /**
   * Search for a specific vital by medical record.
   * @param id medical record
   * @param filter search filter
   */
  async findByMedRecId(id: number, filter?: Filter<VitalSign>): Promise<VitalSign> {
    const res = await get(
      { url: '/api/medicalrecord/{id}/vitalsign', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: VitalSign = await res.json()
    return data
  }

  /**
   * Update a specific vital sign record.
   * @param id registration code
   * @param vitalSign vital sign to update
   */
  async updateById(
    id: number,
    vitalSign: Omit<Partial<VitalSign>, Audit>
  ): Promise<void> {
    await patch({ url: '/api/vitalsign/{id}', params: { id } }, vitalSign)
  }

  /**
   * Delete a specific vital sign record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/vitalsign/{id}', params: { id } })
  }
}
export default new VitalSignService()
