// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/core'
import { RestBindings } from '@loopback/rest'
import { Request } from '@loopback/rest'
import { get } from '@loopback/rest'
import { app } from '../utils'
import spect from './specs/ping.specs'

/**
 * A simple controller to bounce back http requests
 */
export class PingController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  @get('/ping', spect)
  ping(): object {
    return {
      success: true,
      greeting: `Hello from ${app.name.toUpperCase()}-${app.version}`,
      date: new Date()
    }
  }
}
