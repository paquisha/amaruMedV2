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
import { Disease } from '@/models'

class DiseaseService {
  /**
   * Create a new disease record.
   * @param id disease type id
   * @param disease disease to create
   */
  async create(id: number, disease: Partial<Disease>): Promise<Disease> {
    const res = await post(
      { url: '/api/diseasetype/{id}/disease', params: { id } },
      disease
    )
    const data: Disease = res.json()
    return data
  }

  /**
   * Count disease records.
   * @param where search filter
   */
  async count(where?: Where<Disease>): Promise<number> {
    const res = await get('/api/diseases/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search disease records.
   * @param filter search filter
   */
  async find(filter?: Filter<Disease>): Promise<Disease[]> {
    const res = await get('/api/diseases', { filter: JSON.stringify(filter) })
    const data: Disease[] = await res.json()
    return data
  }

  /**
   * Search for a specific disease record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<Disease>): Promise<Disease> {
    const res = await get(
      { url: '/api/disease/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Disease = await res.json()
    return data
  }

  /**
   * Update a specific disease record.
   * @param id registration code
   * @param disease disease to update
   */
  async updateById(id: number, disease: Omit<Partial<Disease>, Audit>): Promise<void> {
    await patch({ url: '/api/disease/{id}', params: { id } }, disease)
  }

  /**
   * Search for a specific disease record.
   * @param id disease type id
   * @param filter search filter
   */
  async findByProfileId(id: number, filter?: Filter<Disease>): Promise<Disease[]> {
    const res = await get(
      { url: '/api/diseasetype/{id}/diseases', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Disease[] = await res.json()
    return data
  }

  /**
   * Delete a specific disease record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/disease/{id}', params: { id } })
  }
}
export default new DiseaseService()
