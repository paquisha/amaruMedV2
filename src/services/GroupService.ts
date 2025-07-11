// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

// Node group: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { get } from '@/services/Service'
import { Filter } from '@/utils/query'
import { Group } from '@/models/GroupModel'

class GroupService {
  /**
   * Search group records by option.
   * @param id option id.
   * @param filter group filter.
   */
  async findByOptionId(id: number, filter?: Filter<Group>) {
    const res = await get(
      { url: '/api/option/{id}/group', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Group[] = res.json()
    return data
  }

  /**
   * Search profile records.
   * @param filter search filter
   */
  async find(filter?: Filter<Group>): Promise<Group[]> {
    const res = await get('/api/groups', { filter: JSON.stringify(filter) })
    const data: Group[] = await res.json()
    return data
  }
}

export default new GroupService()
