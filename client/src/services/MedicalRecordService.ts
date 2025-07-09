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
import { MedicalRecord } from '@/models'

class MedicalRecordService {
  /**
   * Create a new medical record record.
   * @param id patient id
   * @param medicalRecord medical record to create
   */
  async create(
    id: number,
    medicalRecord: Partial<MedicalRecord>
  ): Promise<MedicalRecord> {
    const res = await post(
      { url: '/api/patient/{id}/medicalrecord', params: { id } },
      medicalRecord
    )
    const data: MedicalRecord = res.json()
    return data
  }

  /**
   * Count medical records.
   * @param where search filter
   */
  async count(where?: Where<MedicalRecord>): Promise<number> {
    const res = await get('/api/medicalrecords/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search medical record records.
   * @param filter search filter
   */
  async find(filter?: Filter<MedicalRecord>): Promise<MedicalRecord[]> {
    const res = await get('/api/medicalrecords', { filter: JSON.stringify(filter) })
    const data: MedicalRecord[] = await res.json()
    return data
  }

  /**
   * Search for a specific medical record record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<MedicalRecord>): Promise<MedicalRecord> {
    const res = await get(
      { url: '/api/medicalrecord/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: MedicalRecord = await res.json()
    return data
  }

  /**
   * Update a specific medical record record.
   * @param id registration code
   * @param medicalRecord medical record to update
   */
  async updateById(
    id: number,
    medicalRecord: Omit<Partial<MedicalRecord>, Audit>
  ): Promise<void> {
    await patch({ url: '/api/medicalrecord/{id}', params: { id } }, medicalRecord)
  }

  /**
   * Searching for medical records pertaining to a specific patient..
   * @param id patient id
   * @param filter search filter
   */
  async findByPatientId(
    id: number,
    filter?: Filter<MedicalRecord>
  ): Promise<MedicalRecord[]> {
    const res = await get(
      { url: '/api/patient/{id}/medicalrecords', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: MedicalRecord[] = await res.json()
    return data
  }

  /**
   * Delete a specific medical record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/medicalrecord/{id}', params: { id } })
  }
}
export default new MedicalRecordService()
