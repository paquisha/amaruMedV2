// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { get, HttpErrors, param, post, requestBody } from '@loopback/rest'
import { Filter, repository } from '@loopback/repository'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { UserProfile } from '@loopback/security'
import { ProfileRepository, UserRepository } from '../repositories'
import { AccountService } from '../services'
import { AccountBindings } from '../keys'
import { JWTService } from '../services'
import { TokenBindings } from '../keys'
import { inject } from '@loopback/core'
import { User, Medic } from '../models'
import spec from './specs/medic.specs'

@authenticate('jwt')
export class UserMedicController {
  constructor(
    @repository(UserRepository) protected userRepo: UserRepository,
    @repository(ProfileRepository) protected profileRepo: ProfileRepository,
    @inject(AccountBindings.SERVICE) public acountService: AccountService,
    @inject(TokenBindings.SERVICE) public jwtService: JWTService
  ) {}

  @get('/api/user/{id}/medic', spec.responseOne('User has one Medic'))
  async get(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Medic>
  ): Promise<Medic> {
    return this.userRepo.medic(id).get(filter)
  }

  @post('/api/user/{id}/medic', spec.responseOne())
  async create(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: typeof User.prototype.id,
    @requestBody(spec.requestBody()) medic: Omit<Medic, 'id'>
  ): Promise<Medic> {
    const user = await this.userRepo.findById(id)

    if (!user) throw new HttpErrors.NotFound()
    const profile = await this.profileRepo.findById(user.profileId)

    medic.createdAt = new Date().toLocaleString()
    medic.createdBy = (await this.acountService.convertToUser(session)).id ?? 0
    medic.dni = profile.dni
    medic.passport = profile.passport
    medic.lastName = profile.lastName
    medic.firstName = profile.firstName
    medic.image = profile.image
    medic.telephone = profile.telephone
    medic.mobile = profile.mobile
    medic.email = profile.email
    medic.address = profile.address

    return this.userRepo.medic(id).create(medic)
  }
}
