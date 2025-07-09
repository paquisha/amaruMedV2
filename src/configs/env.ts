// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import path from 'path'

export const SERVER = {
  domain: process.env.AMARUMED_DOMAIN ?? 'http://localhost:3000',
  sandbox: process.env.AMARUMED_SANDBOX ?? path.join(__dirname, '../../.sandbox')
}

export const AMARUMEDPGC = {
  name: 'amarumedPGC',
  connector: 'postgresql',
  url: process.env.AMARUMED_DATABASE_URL,
  host: process.env.AMARUMED_PGC_HOST ?? 'localhost',
  port: process.env.AMARUMED_PGC_PORT ?? 5432,
  user: process.env.AMARUMED_PGC_USER ?? 'postgres',
  password: process.env.AMARUMED_PGC_PASSWORD ?? '1234567890',
  database: process.env.AMARUMED_PGC_DATABASE ?? 'amarumed'
}

export const TOKEN = {
  secret: process.env.AMARUMED_TOKEN_SECRET ?? 'My$3cREtP4$S',
  expiresIn: process.env.AMARUMED_TOKEN_EXPIRES_IN ?? '3600' // it must be a string
}

export const EMAIL = {
  smptHost: process.env.AMARUMED_SMTP_HOST ?? '',
  address: process.env.AMARUMED_EMAIL_ADDRESS ?? '',
  password: process.env.AMARUMED_EMAIL_PASSWORD ?? '',
  isSupported: (): boolean => {
    return (
      process.env.AMARUMED_SMTP_HOST !== undefined &&
      process.env.AMARUMED_EMAIL_ADDRESS !== undefined &&
      process.env.AMARUMED_EMAIL_PASSWORD !== undefined
    )
  }
}
