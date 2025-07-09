// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { post } from '@/services/Service'

class EmailService {
  /**
   * Send email to activate an account.
   * @param email
   */
  async welcome(email: string): Promise<void> {
    await post('/api/email/welcome', { email })
  }

  /**
   * Send email to restore a password.
   * @param email
   */
  async restore(email: string): Promise<void> {
    await post('/api/email/restore', { email })
  }
}

export default new EmailService()
