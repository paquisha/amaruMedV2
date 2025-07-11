// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { get } from '@/services/Service'
import { Filter } from '@/utils/query'
import { Module } from '@/models/ModuleModel'

class ModuleService {
  /**
   * Search module records by role.
   * @param id role id.
   * @param filter module filter.
   */
  async findByRoleId(id: number, filter?: Filter<Module>) {
    const res = await get(
      { url: '/api/role/{id}/modules', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Module[] = res.json()
    return data
  }

  /**
   * Search module records by role.
   * @param id role id.
   * @param filter module filter.
   */
  async findAllowedToMe(filter?: Filter<Module>) {
    const res = await get('/api/myrole/modules', { filter: JSON.stringify(filter) })
    const data: Module[] = res.json()
    return data
  }

  /**
   * Search module records.
   * @param filter search filter
   */
  async find(filter?: Filter<Module>): Promise<Module[]> {
    const res = await get('/api/modules', { filter: JSON.stringify(filter) })
    const data: Module[] = await res.json()
    return data
  }
}

export default new ModuleService()
