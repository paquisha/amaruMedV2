// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { authenticate } from '@loopback/authentication'
import { ProfileRepository } from '../repositories'
import { repository } from '@loopback/repository'
import { UserRepository } from '../repositories'
import { param } from '@loopback/rest'
import spect from './specs/log.specs'
import { get } from '@loopback/rest'
import { Profile } from '../models'
import { Audit } from '../models'
import { User } from '../models'
import { app } from '../utils'

@authenticate('jwt')
export class LogController {
  constructor(
    @repository(ProfileRepository) public profileRepo: ProfileRepository,
    @repository(UserRepository) public userRepo: UserRepository
  ) {}

  @get('/api/logs', spect)
  async ping(@param.query.object('audit') query: Audit): Promise<ResponseAudit> {
    const result: ResponseAudit = {}
    let profile: Profile = new Profile()
    let user: User = new User()

    if (query.createdBy === 0) result.createdBy = { user: app.name, image: '/logo.svg' }

    // creator
    if (query.createdBy && query.createdBy > 0) {
      user = await this.userRepo.findById(query.createdBy)
      profile = await this.profileRepo.findById(user.profileId)
      result.createdBy = {
        user: `${profile.lastName} ${profile.firstName}`,
        image: profile.image
      }
    }

    // last editor
    if (query.editedBy) {
      user = await this.userRepo.findById(query.editedBy)
      profile = await this.profileRepo.findById(user.profileId)
      result.editedBy = {
        user: `${profile.lastName} ${profile.firstName}`,
        image: profile.image
      }
    }

    // thanos
    if (query.deletedBy) {
      user = await this.userRepo.findById(query.deletedBy)
      profile = await this.profileRepo.findById(user.profileId)
      result.deletedBy = {
        user: `${profile.lastName} ${profile.firstName}`,
        image: profile.image
      }
    }

    return result
  }
}

interface ResponseUser {
  user: string
  image?: string
}

interface ResponseAudit {
  createdBy?: ResponseUser
  editedBy?: ResponseUser
  deletedBy?: ResponseUser
}
