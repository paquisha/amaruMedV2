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
import { Permission } from '@/models'

class PermissionService {
  /**
   * Create a new permission record.
   * @param permission permission to create
   */
  async create(permission: Omit<Partial<Permission>, Audit>): Promise<Permission> {
    const res = await post('/api/permission', permission)
    const data: Permission = res.json()
    return data
  }

  /**
   * Count permission records.
   * @param where search filter
   */
  async count(where?: Where<Permission>): Promise<number> {
    const res = await get('/api/permissions/count', { where })
    const data = await res.json()
    return data.count
  }

  /**
   * Search permission records.
   * @param filter search filter
   */
  async find(filter?: Filter<Permission>): Promise<Permission[]> {
    const res = await get('/api/permissions', { filter: JSON.stringify(filter) })
    const data: Permission[] = await res.json()
    return data
  }

  /**
   * Search for a specific permission record.
   * @param id registration code
   * @param filter search filter
   */
  async findById(id: number, filter?: Filter<Permission>): Promise<Permission> {
    const res = await get(
      { url: '/api/permission/{id}', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Permission = await res.json()
    return data
  }

  /**
   * Update a specific permission record.
   * @param id registration code
   * @param permission permission to update
   */
  async updateById(
    id: number,
    permission: Omit<Partial<Permission>, Audit>
  ): Promise<void> {
    await patch({ url: '/api/permission/{id}', params: { id } }, permission)
  }

  /**
   * Delete a specific permission record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/permission/{id}', params: { id } })
  }
}
export default new PermissionService()
