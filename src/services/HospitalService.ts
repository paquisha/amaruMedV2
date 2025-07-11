// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { patch } from '@/services/Service'
import { get } from '@/services/Service'
import { Filter } from '@/utils/query'
import { Hospital } from '@/models'

class HospitalService {
  /**
   * Search for a default hospital.
   * @param filter search filter
   */
  async findDefault(filter?: Filter<Hospital>): Promise<Hospital> {
    const res = await get('/api/company', { filter: JSON.stringify(filter) })
    const data: Hospital = await res.json()
    return data
  }

  /**
   * Update for a default hospital
   * @param hospital hospital to update
   */
  async updateDefault(hospital: Partial<Hospital>): Promise<void> {
    await patch('/api/company', hospital)
  }
}

export default new HospitalService()
