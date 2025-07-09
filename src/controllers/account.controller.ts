// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/core'
import { requestBody, HttpErrors, del } from '@loopback/rest'
import { param } from '@loopback/rest'
import { post } from '@loopback/rest'
import { put } from '@loopback/rest'
import { get } from '@loopback/rest'
import { TokenService } from '@loopback/authentication'
import { UserService } from '@loopback/authentication'
import { authenticate } from '@loopback/authentication'
import { SecurityBindings } from '@loopback/security'
import { UserProfile } from '@loopback/security'
import { repository } from '@loopback/repository'
import { ProfileRepository } from '../repositories'
import { UserRepository } from '../repositories'
import { RoleRepository } from '../repositories'
import { Credentials } from '../utils'
import * as spect from './specs/account.spect'
import { DecryptedHasher } from '../services'
import { AccountService } from '../services'
import { JWTService } from '../services'
import { PasswordBindings } from '../keys'
import { AccountBindings } from '../keys'
import { TokenBindings } from '../keys'
import { UserBindings } from '../keys'
import { Medic, User } from '../models'
import jwt from 'jsonwebtoken'

export class AccountController {
  constructor(
    @inject(UserBindings.SERVICE) public userService: UserService<User, Credentials>,
    @inject(TokenBindings.SESSION_SERVICE) public jwtSessionService: TokenService,
    @inject(TokenBindings.SERVICE) public jwtService: JWTService,
    @inject(AccountBindings.SERVICE) public acountService: AccountService,
    @inject(PasswordBindings.HASHER) public bcrypt: DecryptedHasher,
    @repository(ProfileRepository) public profileRepo: ProfileRepository,
    @repository(UserRepository) public userRepo: UserRepository,
    @repository(RoleRepository) public roleRepo: RoleRepository
  ) {}

  @post('/api/account/login', spect.logged())
  async login(
    @requestBody(spect.login())
    credentials: Credentials
  ): Promise<{ token: string; expiresAt: number }> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials)

    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user)

    // create a JSON Web Token based on the user profile
    const token = await this.jwtSessionService.generateToken(userProfile)

    // token expires at
    const { exp } = jwt.decode(token) as { exp: number }

    return { token, expiresAt: exp }
  }

  @post('/api/account/activate', spect.logged())
  async activate(
    @requestBody(spect.toActivate()) verifier: Verifier
  ): Promise<{ token: string; expiresAt: number }> {
    let token = ''
    const { email } = await this.jwtService.verifyToken(verifier.token)
    const user = await this.userRepo.findOne({
      where: { email, verificationToken: verifier.token }
    })

    if (user) {
      //activate account
      await this.userRepo.updateById(user.id, {
        emailVerified: true,
        // eslint-disable-next-line
        //@ts-ignore
        verificationToken: null,
        password: await this.bcrypt.encrypt(verifier.password)
      })

      // convert a User object into a UserProfile object (reduced set of properties)
      const userProfile = this.userService.convertToUserProfile(user)

      // create a JSON Web Token based on the user profile
      token = await this.jwtSessionService.generateToken(userProfile)
    }
    // token expires at
    const { exp } = jwt.decode(token) as { exp: number }

    return { token, expiresAt: exp }
  }

  @authenticate('jwt')
  @get('/api/account/me', spect.me())
  async currentUser(
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<object> {
    const user = await this.acountService.convertToUser(session)
    const role = await this.roleRepo.findById(user.roleId, {
      fields: { id: true, name: true, description: true }
    })
    const profile = await this.profileRepo.findById(user.profileId)
    let isMedic = false
    let medic: Medic | null = null
    try {
      medic = await this.userRepo.medic(user.id).get()
      isMedic = true
    } catch (error) {
      medic = null
    }

    return { user, role, profile, isMedic, medic }
  }

  @put('/api/account/restore', spect.responseRestorePass())
  async restorePassword(
    @requestBody(spect.toActivate()) verifier: Verifier
  ): Promise<{ token: string; expiresAt: number }> {
    let token = ''
    const { email } = await this.jwtService.verifyToken(verifier.token)

    const user = await this.userRepo.findOne({
      where: { email, passResetToken: verifier.token }
    })

    if (user) {
      await this.userRepo.updateById(user.id, {
        // eslint-disable-next-line
        //@ts-ignore
        passResetToken: null,
        password: await this.bcrypt.encrypt(verifier.password)
      })

      // convert a User object into a UserProfile object (reduced set of properties)
      const userProfile = this.userService.convertToUserProfile(user)

      // create a JSON Web Token based on the user profile
      token = await this.jwtSessionService.generateToken(userProfile)
    }
    // token expires at
    const { exp } = jwt.decode(token) as { exp: number }

    return { token, expiresAt: exp }
  }

  @authenticate('jwt')
  @put('/api/account/user/{id}/password', spect.responseRestorePass())
  async updateUserPassword(
    @param.path.number('id') id: number,
    @requestBody(spect.toChangePassword()) credentrial: ChangePassword
  ): Promise<void> {
    const password: string = await this.bcrypt.encrypt(credentrial.password)
    await this.userRepo.updateById(id, { password })
  }

  @authenticate('jwt')
  @put('/api/account/password', spect.responseUpdateMePass())
  async updateMePassword(
    @requestBody(spect.toUpdateMyPassword()) credential: UpdatePassword,
    @inject(SecurityBindings.USER) session: UserProfile
  ): Promise<void> {
    const me = await this.acountService.convertToUser(session)

    const passwordMatched = me.password
      ? await this.bcrypt.compare(credential.currentPassword, me.password)
      : false

    if (!passwordMatched) throw new HttpErrors.Unauthorized('BAD_CURRENT_PASS')

    const password: string = await this.bcrypt.encrypt(credential.newPassword)
    // eslint-disable-next-line
    //@ts-ignore
    await this.userRepo.updateById(me.id, { password, passResetToken: null })
  }

  @authenticate('jwt')
  @del('/api/account/user/{id}', spect.responseDelete())
  async deleteById(
    @inject(SecurityBindings.USER) session: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    const me = await this.acountService.convertToUser(session)
    const { emailVerified, profileId } = await this.userRepo.findById(id)
    if (emailVerified) {
      await this.profileRepo.updateById(profileId, {
        deleted: true,
        deletedBy: me.id,
        deletedAt: new Date().toLocaleString()
      })
      await this.userRepo.updateById(id, {
        deleted: true,
        deletedBy: me.id,
        deletedAt: new Date().toLocaleString()
      })
    } else {
      await this.userRepo.deleteById(id)
      await this.profileRepo.deleteById(profileId)
    }
  }
}

interface ChangePassword {
  password: string
}

interface UpdatePassword {
  newPassword: string
  currentPassword: string
}

interface Verifier {
  token: string
  password: string
}
