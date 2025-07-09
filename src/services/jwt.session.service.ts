// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { TokenService } from '@loopback/authentication'
import { UserProfile } from '@loopback/security'
import { HttpErrors } from '@loopback/rest'
import { inject } from '@loopback/context'
import { TokenBindings } from '../keys'
import jwt from 'jsonwebtoken'

export class JWTSessionService implements TokenService {
  constructor(
    @inject(TokenBindings.SECRET) private jwtSecret: string,
    @inject(TokenBindings.EXPIRES_IN) private jwtExpiresIn: string
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors.Unauthorized('NO_TOKEN')
    }

    let userProfile: UserProfile
    try {
      // decode user profile from token
      userProfile = jwt.verify(token, this.jwtSecret) as UserProfile
    } catch (error) {
      throw new HttpErrors.Unauthorized('TOKEN_EXPIRED')
    }

    return userProfile
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized('Error generating token: userProfile is null')
    }

    // Generate a JSON Web Token
    let token: string
    try {
      token = jwt.sign(userProfile, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn)
      })
    } catch (error) {
      throw new HttpErrors.Unauthorized(`Error encoding token: ${error}`)
    }

    return token
  }
}
