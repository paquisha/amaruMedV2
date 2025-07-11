// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Audit } from '@/services/Service'
import { patch } from '@/services/Service'
import { post } from '@/services/Service'
import { get } from '@/services/Service'
import { Filter } from '@/utils/query'
import { Where } from '@/utils/query'
import { User } from '@/models'

class UserService {
  /**
   * Create a new user record.
   * @param id profile id
   * @param user user to create
   */
  async createByProfileId(id: number, user: Partial<User>): Promise<User> {
    const res = await post({ url: '/api/profile/{id}/user', params: { id } }, user)
    const data: User = res.json()
    return data
  }

  /**
   * Count user records.
   * @param where search filter
   */
  async count(where?: Where<User>): Promise<number> {
    const res = await get('/api/users/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search user records.
   * @param filter search filter
   */
  async find(filter?: Filter<User>): Promise<User[]> {
    const res = await get('/api/users', { filter: JSON.stringify(filter) })
    const data: User[] = await res.json()
    return data
  }

  /**
   * Search for a specific user record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<User>): Promise<User> {
    const res = await get(
      { url: '/api/user/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: User = await res.json()
    return data
  }

  /**
   * Update a specific user record.
   * @param id registration code
   * @param user user to update
   */
  async updateById(id: number, user: Omit<Partial<User>, Audit>): Promise<void> {
    await patch({ url: '/api/user/{id}', params: { id } }, user)
  }

  /**
   * Search for a specific user record.
   * @param id profile id
   * @param filter search filter
   */
  async findByProfileId(id: number, filter?: Filter<User>): Promise<User> {
    const res = await get(
      { url: '/api/profile/{id}/user', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: User = await res.json()
    return data
  }
}
export default new UserService()
