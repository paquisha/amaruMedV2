// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { authenticate } from '@loopback/authentication'
import { UserProfile } from '@loopback/security'
import { SecurityBindings } from '@loopback/security'
import { inject } from '@loopback/core'
import { Count } from '@loopback/repository'
import { Filter } from '@loopback/repository'
import { FilterExcludingWhere } from '@loopback/repository'
import { repository } from '@loopback/repository'
import { ProfileRepository } from '../repositories'
import { UserRepository } from '../repositories'
import { Where } from '@loopback/repository'
import { post } from '@loopback/rest'
import { param } from '@loopback/rest'
import { get } from '@loopback/rest'
import { patch } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { Profile } from '../models'
import { AccountBindings } from '../keys'
import { AccountService } from '../services'
import spec from './specs/profile.specs'

@authenticate('jwt')
export class ProfileController {
  constructor(
    @repository(UserRepository) public userRepo: UserRepository,
    @repository(ProfileRepository) public profileRepo: ProfileRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService
  ) {}

  @post('/api/profile', spec.responseOne())
  async create(
    @requestBody(spec.requestBody()) profile: Omit<Profile, 'id'>,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<Profile> {
    profile.createdAt = new Date().toLocaleString()
    profile.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    return this.profileRepo.create(profile)
  }

  @get('/api/profiles/count', spec.responseCount())
  async count(@param.where(Profile) where?: Where<Profile>): Promise<Count> {
    return this.profileRepo.count(where)
  }

  @get('/api/profiles', spec.responseList())
  async find(@param.filter(Profile) filter?: Filter<Profile>): Promise<Profile[]> {
    return this.profileRepo.find(filter)
  }

  @patch('/api/profiles', spec.responsePatchCount())
  async updateAll(
    @requestBody(spec.requestPartialBoby()) profile: Profile,
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.where(Profile) where?: Where<Profile>
  ): Promise<Count> {
    profile.editedAt = new Date().toLocaleString()
    profile.editedBy = (await this.acountService.convertToUser(session)).id
    return this.profileRepo.updateAll(profile, where)
  }

  @get('/api/profile/{id}', spec.responseOne())
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Profile, { exclude: 'where' })
    filter?: FilterExcludingWhere<Profile>
  ): Promise<Profile> {
    return this.profileRepo.findById(id, filter)
  }

  @get('/api/profile/user/{id}', spec.responseOne())
  async findFromUserId(
    @param.path.number('id') id: number,
    @param.filter(Profile, { exclude: 'where' })
    filter?: FilterExcludingWhere<Profile>
  ): Promise<Profile> {
    const user = await this.userRepo.findById(id)
    return this.profileRepo.findById(user.profileId, filter)
  }

  @patch('/api/profile/{id}', spec.responseSimple('PATCH'))
  async updateById(
    @param.path.number('id') id: number,
    @requestBody(spec.requestPartialBoby()) profile: Profile,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    profile.editedAt = new Date().toLocaleString()
    profile.editedBy = (await this.acountService.convertToUser(session)).id
    await this.profileRepo.updateById(id, profile)
  }
}
