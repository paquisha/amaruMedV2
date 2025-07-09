// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { post } from '@/services/Service'
import { get } from '@/services/Service'
import { Rpe } from '@/models'

class RpeService {
  /**
   * Create a new rpe record.
   * @param id medical record id
   * @param rpe rpe to create
   */
  async create(id: number, rpe: Partial<Rpe>): Promise<Rpe> {
    const res = await post({ url: '/api/medicalrecord/{id}/rpe', params: { id } }, rpe)
    const data: Rpe = res.json()
    return data
  }
}

export default new RpeService()
