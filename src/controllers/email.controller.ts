// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import path from 'path'
import { inject } from '@loopback/core'
import { authenticate } from '@loopback/authentication'
import { repository } from '@loopback/repository'
import { HttpErrors } from '@loopback/rest'
import { post, requestBody } from '@loopback/rest'
import { ProfileRepository } from '../repositories'
import { CompanyRepository } from '../repositories'
import { UserRepository } from '../repositories'
import * as spect from './specs/email.specs'
import { StorageService, JWTService } from '../services'
import { EmailService } from '../services'
import { StorageBindings, TokenBindings } from '../keys'
import { EmailBindings } from '../keys'
import { EMAIL } from '../configs'

export class EmailController {
  constructor(
    @inject(StorageBindings.SERVICE) public storageService: StorageService,
    @inject(EmailBindings.SERVICE) public emailService: EmailService,
    @inject(TokenBindings.SERVICE) public jwtService: JWTService,
    @repository(UserRepository) public userRepo: UserRepository,
    @repository(CompanyRepository) public companyRepo: CompanyRepository,
    @repository(ProfileRepository) public profileRepo: ProfileRepository
  ) {}

  @authenticate('jwt')
  @post('/api/email/welcome', spect.response())
  async activateAccunt(
    @requestBody(spect.email()) { email }: { email: string }
  ): Promise<void> {
    if (!EMAIL.isSupported()) {
      throw new HttpErrors.Forbidden('EMAIL_NOT_SUPPORTED')
    }

    const user = await this.userRepo.findOne({ where: { email } })

    if (user) {
      const profile = await this.profileRepo.findById(user?.profileId)

      await this.emailService.welcome({
        logo: await this.companyLogo(),
        username: profile.firstName,
        image: profile.image,
        email: user.email,
        token: user.verificationToken
      })
    } else {
      throw new HttpErrors.BadRequest('BAD_ACCOUNT')
    }
  }

  @post('/api/email/restore', spect.noContent('Restore password request'))
  async restorePasswort(
    @requestBody(spect.email()) { email }: { email: string }
  ): Promise<void> {
    if (!EMAIL.isSupported()) {
      throw new HttpErrors.Forbidden('EMAIL_NOT_SUPPORTED')
    }

    const user = await this.userRepo.findOne({ where: { email } })

    if (user) {
      if (user.deleted === true || user.isActive === false)
        throw new HttpErrors.Unauthorized('INACTIVE_ACCOUNT')

      if (user.emailVerified === false)
        throw new HttpErrors.Unauthorized('EMAIL_NOT_VERIFIED')

      const token = await this.jwtService.generateToken(user.email, 600)
      await this.userRepo.updateById(user.id, {
        passResetToken: token
      })

      const profile = await this.profileRepo.findById(user?.profileId)

      await this.emailService.restorePassword({
        logo: await this.companyLogo(),
        username: profile.firstName,
        image: profile.image,
        email: user.email,
        token
      })
    } else {
      throw new HttpErrors.BadRequest('BAD_ACCOUNT')
    }
  }

  private async companyLogo(): Promise<string> {
    const company = await this.companyRepo.findById(1)
    let logo: string = path.resolve('./public/public/logo.svg')
    if (company)
      if (company.logo)
        logo = this.storageService.getSandbox(company.logo?.split('/').pop() ?? '')

    return logo
  }
}
