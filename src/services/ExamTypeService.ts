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
import { ExamType } from '@/models'

class ExamTypeService implements Crud<ExamType> {
  /**
   * Create a new exam type record.
   * @param examType exam type to create
   */
  async create(examType: Omit<Partial<ExamType>, Audit>): Promise<ExamType> {
    const res = await post('/api/examtype', examType)
    const data: ExamType = res.json()
    return data
  }

  /**
   * Count exam type records.
   * @param where search filter
   */
  async count(where?: Where<ExamType>): Promise<number> {
    const res = await get('/api/examtypes/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search exam type records.
   * @param filter search filter
   */
  async find(filter?: Filter<ExamType>): Promise<ExamType[]> {
    const res = await get('/api/examtypes', { filter: JSON.stringify(filter) })
    const data: ExamType[] = await res.json()
    return data
  }

  /**
   * Search for a specific exam type record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<ExamType>): Promise<ExamType> {
    const res = await get(
      { url: '/api/examtype/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: ExamType = await res.json()
    return data
  }

  /**
   * Update a specific exam type record.
   * @param id registration code
   * @param examType exam type to update
   */
  async updateById(id: number, examType: Omit<Partial<ExamType>, Audit>): Promise<void> {
    await patch({ url: '/api/examtype/{id}', params: { id } }, examType)
  }

  /**
   * Delete a specific exam type record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/examtype/{id}', params: { id } })
  }
}
export default new ExamTypeService()
