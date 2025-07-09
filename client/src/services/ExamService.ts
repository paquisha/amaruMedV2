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
import { Exam } from '@/models'

class ExamService {
  /**
   * Create a new exam record.
   * @param id exam type id
   * @param exam exam to create
   */
  async create(id: number, exam: Partial<Exam>): Promise<Exam> {
    const res = await post({ url: '/api/examtype/{id}/exam', params: { id } }, exam)
    const data: Exam = res.json()
    return data
  }

  /**
   * Count exam records.
   * @param where search filter
   */
  async count(where?: Where<Exam>): Promise<number> {
    const res = await get('/api/exams/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search exam records.
   * @param filter search filter
   */
  async find(filter?: Filter<Exam>): Promise<Exam[]> {
    const res = await get('/api/exams', { filter: JSON.stringify(filter) })
    const data: Exam[] = await res.json()
    return data
  }

  /**
   * Search for a specific exam record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<Exam>): Promise<Exam> {
    const res = await get(
      { url: '/api/exam/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Exam = await res.json()
    return data
  }

  /**
   * Update a specific exam record.
   * @param id registration code
   * @param exam exam to update
   */
  async updateById(id: number, exam: Omit<Partial<Exam>, Audit>): Promise<void> {
    await patch({ url: '/api/exam/{id}', params: { id } }, exam)
  }

  /**
   * Search for a specific exam record.
   * @param id exam type id
   * @param filter search filter
   */
  async findByProfileId(id: number, filter?: Filter<Exam>): Promise<Exam[]> {
    const res = await get(
      { url: '/api/examtype/{id}/exams', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Exam[] = await res.json()
    return data
  }

  /**
   * Delete a specific exam record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/exam/{id}', params: { id } })
  }
}
export default new ExamService()
