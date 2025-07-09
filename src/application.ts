// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { BootMixin } from '@loopback/boot'
import { registerAuthenticationStrategy } from '@loopback/authentication'
import { AuthenticationComponent } from '@loopback/authentication'
import { ApplicationConfig, BindingKey } from '@loopback/core'
import { RestExplorerComponent } from '@loopback/rest-explorer'
import { RestExplorerBindings } from '@loopback/rest-explorer'
import { RepositoryMixin } from '@loopback/repository'
import { RestApplication } from '@loopback/rest'
import { ServiceMixin } from '@loopback/service-proxy'
import { JWTAuthenticationStrategy } from './auth'
import { SECURITY_SCHEME_SPEC } from './auth'
import path from 'path'
import { MySequence } from './sequence'
import { JWTSessionService, MyJWTService } from './services'
import { MyAccountService } from './services'
import { MyStorageService } from './services'
import { MyEmailService } from './services'
import { MyUserService } from './services'
import { BcryptHasher } from './services'
import { PasswordBindings } from './keys'
import { StorageBindings } from './keys'
import { AccountBindings } from './keys'
import { TokenBindings } from './keys'
import { EmailBindings } from './keys'
import { UserBindings } from './keys'
import { Pkg, app } from './utils'
import { TOKEN } from './configs'

/**
 * Information from package.json
 */

export const PackageKey = BindingKey.create<Pkg>('application.package')

export { ApplicationConfig }

export class Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication))
) {
  constructor(options: ApplicationConfig = {}) {
    super(options)

    this.api({
      openapi: '3.0.0',
      info: {
        title: app.name,
        version: app.version,
        description: app.description
      },
      paths: {},
      components: { securitySchemes: SECURITY_SCHEME_SPEC },
      servers: [{ url: '/' }]
    })

    // setup bindings
    this.setUpBindings()

    // Bind authentication component related elements
    this.component(AuthenticationComponent)

    registerAuthenticationStrategy(this, JWTAuthenticationStrategy)

    // Set up the custom sequence
    this.sequence(MySequence)

    // Set up default web client
    this.static('/', path.join(__dirname, '../public/client'))

    // Set up public files
    this.static('/', path.join(__dirname, '../public/public'))

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/api/explorer'
    })
    this.component(RestExplorerComponent)

    this.projectRoot = __dirname
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true
      }
    }
  }

  setUpBindings(): void {
    // Bind package.json to the application context
    this.bind(PackageKey).to(app)

    // token service
    this.bind(TokenBindings.SECRET).to(TOKEN.secret)
    this.bind(TokenBindings.EXPIRES_IN).to(TOKEN.expiresIn)
    this.bind(TokenBindings.SERVICE).toClass(MyJWTService)
    this.bind(TokenBindings.SESSION_SERVICE).toClass(JWTSessionService)

    // Bind bcrypt hash services
    this.bind(PasswordBindings.ROUNDS).to(10)
    this.bind(PasswordBindings.HASHER).toClass(BcryptHasher)

    // User service
    this.bind(UserBindings.SERVICE).toClass(MyUserService)

    // Account services
    this.bind(AccountBindings.SERVICE).toClass(MyAccountService)

    // Storage service
    this.bind(StorageBindings.SERVICE).toClass(MyStorageService)

    // Email service
    this.bind(EmailBindings.SERVICE).toClass(MyEmailService)
  }
}
