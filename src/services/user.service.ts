// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/context'
import { HttpErrors } from '@loopback/rest'
import { UserService } from '@loopback/authentication'
import { repository } from '@loopback/repository'
import { UserProfile } from '@loopback/security'
import { securityId } from '@loopback/security'
import { UserRepository } from '../repositories'
import { PasswordBindings } from '../keys'
import { Credentials } from '../utils'
import { DecryptedHasher } from '.'
import { User } from '../models'

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository) public userRepository: UserRepository,
    @inject(PasswordBindings.HASHER) public bcrypt: DecryptedHasher
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const result = await this.userRepository.findOne({
      where: { email: credentials.email.toLowerCase() }
    })
    if (!result) throw new HttpErrors.Unauthorized('BAD_ACCOUNT')
    if (result.deleted === true || result.isActive === false)
      throw new HttpErrors.Unauthorized('INACTIVE_ACCOUNT')
    if (result.emailVerified === false)
      throw new HttpErrors.Unauthorized('EMAIL_NOT_VERIFIED')

    const user: User = new User(result || undefined)

    const passwordMatched = user.password
      ? await this.bcrypt.compare(credentials.password, user.password)
      : false

    if (passwordMatched) return user
    else throw new HttpErrors.Unauthorized('BAD_PASS')
  }

  convertToUserProfile(user: User): UserProfile {
    // eslint-disable-next-line
    // @ts-ignore
    return { [securityId]: user.id, name: user.email }
  }
}
