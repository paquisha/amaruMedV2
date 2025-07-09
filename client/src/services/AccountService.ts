// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { post } from '@/services/Service'
import { put } from '@/services/Service'
import { get } from '@/services/Service'
import { del } from '@/services/Service'
import { Medic, Profile, User } from '@/models'

interface Session {
  token: string
  expiresAt: number
}

class AccountService {
  /**
   * Request to obtain the access token.
   * @param email
   * @param password
   */
  async login(email: string, password: string): Promise<Session> {
    const res = await post('/api/account/login', { email, password })
    const data = await res.json()
    const token: string = `Bearer ${data.token}`

    return { token, expiresAt: data.expiresAt }
  }

  /**
   * Request for information on a logged account.
   */
  async me(): Promise<{ user: User; profile: Profile; isMedic: boolean; medic?: Medic }> {
    const res = await get('/api/account/me')
    return res.json()
  }

  /**
   * Request to activate an account.
   * @param password
   * @param token
   */
  async activate(password: string, token: string): Promise<Session> {
    const res = await post('/api/account/activate', {
      password,
      token
    })
    let data = await res.json()

    data.token = `Bearer ${data.token}`

    return { token: data.token, expiresAt: data.expiresAt }
  }

  /**
   * Request to restore an account.
   * @param password
   * @param token
   */
  async restore(password: string, token: string): Promise<Session> {
    const res = await put('/api/account/restore', {
      password,
      token
    })
    let data = await res.json()

    data.token = `Bearer ${data.token}`

    return { token: data.token, expiresAt: data.expiresAt }
  }

  /**
   * Request to change a password from a user account.
   * @param id user id
   * @param password
   */
  async changePasswordByUserId(id: number, password: string): Promise<void> {
    await put({ url: '/api/account/user/{id}/password', params: { id } }, { password })
  }

  /**
   * Request to change a password from a logged user account.
   * @param currentPassword
   * @param newPassword
   */
  async changeMyPassword(currentPassword: string, newPassword: string): Promise<void> {
    await put('/api/account/password', { currentPassword, newPassword })
  }

  /**
   * Delete a specific user record.
   * @param id
   */
  async delete(id: number): Promise<void> {
    await del({ url: '/api/account/user/{id}', params: { id } })
  }
}

export default new AccountService()
