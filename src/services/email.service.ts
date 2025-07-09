// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import * as nodemailer from 'nodemailer'
import { resolve } from 'path'
import { renderFile } from 'ejs'
import { SERVER } from '../configs'
import { EMAIL } from '../configs'
import { imgToURI } from '../utils'
import { app } from '../utils'

interface EmailAccount {
  logo: string
  username: string
  image?: string
  email: string
  token: string
}

export interface EmailService {
  /**
   * Send the welcome email with the account activation code.
   */
  welcome(config: EmailAccount): Promise<void>
  restorePassword(config: EmailAccount): Promise<void>
}

export class MyEmailService implements EmailService {
  private transporter = nodemailer.createTransport({
    host: EMAIL.smptHost,
    port: 587,
    secure: false, // true for 465, false for other ports
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: EMAIL.address,
      pass: EMAIL.password
    }
  })

  private emailPath(name: string): string {
    return resolve(__dirname, '../../public/emails/', name)
  }

  async welcome(config: EmailAccount): Promise<void> {
    if (EMAIL.isSupported()) {
      const mailOptions = {
        from: `${app.name} <${EMAIL.address}>`,
        to: config.email,
        subject: 'Bienvenido',
        html: await renderFile(this.emailPath('welcome.ejs'), {
          logo: imgToURI(config.logo),
          appUrl: SERVER.domain,
          username: config.username,
          query: JSON.stringify({
            username: config.username,
            image: config.image,
            token: config.token
          })
        })
      }

      await this.transporter.sendMail(mailOptions)
    }
  }

  async restorePassword(config: EmailAccount): Promise<void> {
    if (EMAIL.isSupported()) {
      const mailOptions = {
        from: `${app.name} <${EMAIL.address}>`,
        to: config.email,
        subject: 'Restaurar contraseña',
        html: await renderFile(this.emailPath('restore.password.ejs'), {
          logo: imgToURI(config.logo),
          appUrl: SERVER.domain,
          username: config.username,
          query: JSON.stringify({
            username: config.username,
            image: config.image,
            token: config.token
          })
        })
      }

      await this.transporter.sendMail(mailOptions)
    }
  }
}
