// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { HttpErrors } from '@loopback/rest'
import { inject } from '@loopback/context'
import { TokenBindings } from '../keys'
import jwt from 'jsonwebtoken'

export interface JWTService {
  generateToken(email: string, duration?: number): Promise<string>
  verifyToken(token: string): Promise<{ email: string }>
}

export class MyJWTService implements JWTService {
  constructor(@inject(TokenBindings.SECRET) private jwtSecret: string) {}

  generateToken(email: string, duration?: number): Promise<string> {
    if (!email) {
      throw new HttpErrors.Unauthorized('Error generating token: email is null')
    }

    // Generate a JSON Web Token

    return new Promise<string>((resolve, reject) => {
      try {
        const tokenGenerated: string = jwt.sign(
          { email },
          this.jwtSecret,
          duration ? { expiresIn: duration } : {}
        )
        resolve(tokenGenerated)
      } catch (error) {
        reject(new HttpErrors.Unauthorized(`Error encoding token: ${error}`))
      }
    })
  }
  verifyToken(token: string): Promise<{ email: string }> {
    if (!token) {
      throw new HttpErrors.Unauthorized('NO_TOKEN')
    }
    return new Promise<{ email: string }>((resolve, reject) => {
      try {
        const result = jwt.verify(token, this.jwtSecret) as {
          email: string
        }
        resolve(result)
      } catch (error) {
        reject(new HttpErrors.Unauthorized(`TOKEN_EXPIRED`))
      }
    })
  }
}
