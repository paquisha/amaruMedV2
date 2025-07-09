// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { genSalt } from 'bcryptjs'
import { hash } from 'bcryptjs'
import { compare } from 'bcryptjs'
import { inject } from '@loopback/core'
import { PasswordBindings } from '../keys'

/**
 * Service HashPassword using module 'bcryptjs'.
 * It takes in a plain password, generates a salt with given
 * round and returns the hashed password as a string
 */
export type HashDecrypted = (password: string, rounds: number) => Promise<string>
// bind function to `services.bcryptjs.HashPassword`
export async function hashDecrypted(password: string, rounds: number): Promise<string> {
  const salt = await genSalt(rounds)
  return hash(password, salt)
}

export interface DecryptedHasher<T = string> {
  encrypt(decrypted: T): Promise<T>
  compare(decrypted: T, encrypted: T): Promise<boolean>
}

export class BcryptHasher implements DecryptedHasher<string> {
  constructor(
    @inject(PasswordBindings.ROUNDS)
    private readonly rounds: number
  ) {}
  /**
   * Encrypt a string
   * @param decrypted string to encript
   */
  async encrypt(password: string): Promise<string> {
    const salt = await genSalt(this.rounds)
    return hash(password, salt)
  }
  /**
   * Compare a string with a encrypted string
   * @param decrypted original string
   * @param encrypted encrypted string
   */
  async compare(decrypted: string, encrypted: string): Promise<boolean> {
    const passwordIsMatched = await compare(decrypted, encrypted)
    return passwordIsMatched
  }
}
