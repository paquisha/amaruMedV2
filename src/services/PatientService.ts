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
import { Patient } from '@/models'

class PatientService {
  /**
   * Create a new patient record.
   * @param patient patient to create
   */
  async create(patient: Omit<Partial<Patient>, Audit>): Promise<Patient> {
    const res = await post('/api/patient', patient)
    const data: Patient = res.json()
    return data
  }

  /**
   * Count patient records.
   * @param where search filter
   */
  async count(where?: Where<Patient>): Promise<number> {
    const res = await get('/api/patients/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search patient records.
   * @param filter search filter
   */
  async find(filter?: Filter<Patient>): Promise<Patient[]> {
    const res = await get('/api/patients', { filter: JSON.stringify(filter) })
    const data: Patient[] = await res.json()
    return data
  }

  /**
   * Search for a specific patient record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<Patient>): Promise<Patient> {
    const res = await get(
      { url: '/api/patient/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Patient = await res.json()
    return data
  }

  /**
   * Update a specific patient record.
   * @param id registration code
   * @param patient patient to update
   */
  async updateById(id: number, patient: Omit<Partial<Patient>, Audit>): Promise<void> {
    await patch({ url: '/api/patient/{id}', params: { id } }, patient)
  }

  /**
   * Delete a specific patient record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/patient/{id}', params: { id } })
  }
}
export default new PatientService()
