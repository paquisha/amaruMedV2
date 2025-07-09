// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { authenticate } from '@loopback/authentication'
import { repository, Filter } from '@loopback/repository'
import { SecurityBindings } from '@loopback/security'
import { UserProfile } from '@loopback/security'
import { requestBody } from '@loopback/rest'
import { inject } from '@loopback/core'
import { param } from '@loopback/rest'
import { post } from '@loopback/rest'
import { get } from '@loopback/rest'
import { ProfileRepository } from '../repositories'
import { AccountService } from '../services'
import { JWTService } from '../services'
import { AccountBindings } from '../keys'
import { TokenBindings } from '../keys'
import { Profile, User } from '../models'
import spec from './specs/user.specs'

@authenticate('jwt')
export class ProfileUserController {
  constructor(
    @repository(ProfileRepository) protected profileRepository: ProfileRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService,
    @inject(TokenBindings.SERVICE) public jwtService: JWTService
  ) {}

  @get('/api/profile/{id}/user', spec.responseOne('Profile has one User'))
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<User>
  ): Promise<User> {
    return this.profileRepository.user(id).get(filter)
  }

  @post('/api/profile/{id}/user', spec.responseOne())
  async create(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: typeof Profile.prototype.id,
    @requestBody(spec.requestBody()) user: Omit<User, 'id'>
  ): Promise<User> {
    user.createdAt = new Date().toLocaleString()
    user.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    user.verificationToken = await this.jwtService.generateToken(user.email)
    return this.profileRepository.user(id).create(user)
  }
}
