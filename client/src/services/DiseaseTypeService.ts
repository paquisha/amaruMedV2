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
import { DiseaseType } from '@/models'

class DiseaseTypeService implements Crud<DiseaseType> {
  /**
   * Create a new disease type record.
   * @param diseaseType disease type to create
   */
  async create(diseaseType: Omit<Partial<DiseaseType>, Audit>): Promise<DiseaseType> {
    const res = await post('/api/diseasetype', diseaseType)
    const data: DiseaseType = res.json()
    return data
  }

  /**
   * Count disease type records.
   * @param where search filter
   */
  async count(where?: Where<DiseaseType>): Promise<number> {
    const res = await get('/api/diseasetypes/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search disease type records.
   * @param filter search filter
   */
  async find(filter?: Filter<DiseaseType>): Promise<DiseaseType[]> {
    const res = await get('/api/diseasetypes', { filter: JSON.stringify(filter) })
    const data: DiseaseType[] = await res.json()
    return data
  }

  /**
   * Search for a specific disease type record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<DiseaseType>): Promise<DiseaseType> {
    const res = await get(
      { url: '/api/diseasetype/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: DiseaseType = await res.json()
    return data
  }

  /**
   * Update a specific disease type record.
   * @param id registration code
   * @param diseaseType disease type to update
   */
  async updateById(
    id: number,
    diseaseType: Omit<Partial<DiseaseType>, Audit>
  ): Promise<void> {
    await patch({ url: '/api/diseasetype/{id}', params: { id } }, diseaseType)
  }

  /**
   * Delete a specific disease type record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/diseasetype/{id}', params: { id } })
  }
}
export default new DiseaseTypeService()
