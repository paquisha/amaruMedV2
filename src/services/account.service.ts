// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { repository } from '@loopback/repository'
import { UserProfile } from '@loopback/security'
import { UserRepository } from '../repositories'
import { User } from '../models/user.model'

export interface AccountService {
  convertToUser(userProfile: UserProfile): Promise<User>
}

export class MyAccountService implements AccountService {
  constructor(@repository(UserRepository) public userRepository: UserRepository) {}

  async convertToUser(userProfile: UserProfile): Promise<User> {
    // eslint-disable-next-line
    let result: any = await this.userRepository.findOne({
      where: {
        email: userProfile.name
      }
    })

    const user: User = new User(result ?? undefined)
    return user
  }
}
