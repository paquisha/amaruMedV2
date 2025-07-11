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
import { Role } from '@/models'

class RoleService implements Crud<Role> {
  /**
   * Create a new role record.
   * @param role role to create
   */
  async create(role: Omit<Partial<Role>, Audit>): Promise<Role> {
    const res = await post('/api/role', role)
    const data: Role = res.json()
    return data
  }

  /**
   * Count role records.
   * @param where search filter
   */
  async count(where?: Where<Role>): Promise<number> {
    const res = await get('/api/roles/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search role records.
   * @param filter search filter
   */
  async find(filter?: Filter<Role>): Promise<Role[]> {
    const res = await get('/api/roles', { filter: JSON.stringify(filter) })
    const data: Role[] = await res.json()
    return data
  }

  /**
   * Search for a specific role record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<Role>): Promise<Role> {
    const res = await get(
      { url: '/api/role/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Role = await res.json()
    return data
  }

  /**
   * Update a specific role record.
   * @param id registration code
   * @param role role to update
   */
  async updateById(id: number, role: Omit<Partial<Role>, Audit>): Promise<void> {
    await patch({ url: '/api/role/{id}', params: { id } }, role)
  }

  /**
   * Delete a specific role record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/role/{id}', params: { id } })
  }
}
export default new RoleService()
