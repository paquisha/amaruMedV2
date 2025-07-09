// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { UserRepository } from '../../repositories'
import { setupApplication } from '../init/setup.spec'
import { DEFAULT_ADMIN } from '../../migrations'
import { Application } from '../..'
import { message } from '../../utils'

let app: Application
let client: Client
let adminId: number
let repository: UserRepository

before('setupApplication', async () => {
  ;({ app, client } = await setupApplication())
  repository = await app.getRepository(UserRepository)
  adminId =
    (
      await repository.findOne({
        where: { email: DEFAULT_ADMIN.email }
      })
    )?.id ?? 0
})

after(async () => {
  await app.stop()
})

describe(message.endpoint('Account'), () => {
  it('POST    =>  /api/account/login      (Incorrect email)', async () => {
    await client
      .post('/api/account/login')
      .send({
        email: DEFAULT_ADMIN.email + '.extra',
        password: DEFAULT_ADMIN.password
      })
      .expect(401)
      .then(err => {
        expect(err.body)
          .to.have.property('error')
          .to.have.property('message')
          .to.be.equal('BAD_ACCOUNT')
      })
  })

  it('POST    =>  /api/account/login      (Incorrect password)', async () => {
    await client
      .post('/api/account/login')
      .send({ email: DEFAULT_ADMIN.email, password: 'password' })
      .expect(401)
      .then(err => {
        expect(err.body)
          .to.have.property('error')
          .to.have.property('message')
          .to.be.equal('BAD_PASS')
      })
  })

  it('POST    =>  /api/account/login      (Email not verified)', async () => {
    await repository.updateById(adminId, { emailVerified: false })
    await client
      .post('/api/account/login')
      .send({
        email: DEFAULT_ADMIN.email,
        password: DEFAULT_ADMIN.password
      })
      .expect(401)
      .then(err => {
        expect(err.body)
          .to.have.property('error')
          .to.have.property('message')
          .to.be.equal('EMAIL_NOT_VERIFIED')
      })
    await repository.updateById(adminId, { emailVerified: true })
  })

  it('POST    =>  /api/account/login      (Inactive account)', async () => {
    await repository.updateById(adminId, { isActive: false })
    await client
      .post('/api/account/login')
      .send({
        email: DEFAULT_ADMIN.email,
        password: DEFAULT_ADMIN.password
      })
      .expect(401)
      .then(err => {
        expect(err.body)
          .to.have.property('error')
          .to.have.property('message')
          .to.be.equal('INACTIVE_ACCOUNT')
      })
    await repository.updateById(adminId, { isActive: true })
  })

  it('POST    =>  /api/account/login      (Deleted account)', async () => {
    await repository.updateById(adminId, { deleted: true })
    await client
      .post('/api/account/login')
      .send({
        email: DEFAULT_ADMIN.email,
        password: DEFAULT_ADMIN.password
      })
      .expect(401)
      .then(err => {
        expect(err.body)
          .to.have.property('error')
          .to.have.property('message')
          .to.be.equal('INACTIVE_ACCOUNT')
      })
    await repository.updateById(adminId, { deleted: false })
  })

  it('POST    =>  /api/account/login      (Correct credentials)', async () => {
    await client
      .post('/api/account/login')
      .send({
        email: DEFAULT_ADMIN.email,
        password: DEFAULT_ADMIN.password
      })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('token').to.be.not.null()
      })
  })

  it('POST    =>  /api/account/me         (Account without access)', async () => {
    await client.get('/api/account/me').then(err => {
      expect(err.body)
        .to.have.property('error')
        .to.have.property('message')
        .to.be.equal('NO_TOKEN')
    })
  })

  it('POST    =>  /api/account/me         (Account with access)', async () => {
    await client
      .post('/api/account/login')
      .send({
        email: DEFAULT_ADMIN.email,
        password: DEFAULT_ADMIN.password
      })
      .then(async ({ body }) => {
        await client
          .get('/api/account/me')
          .auth(body.token, { type: 'bearer' })
          .then(res => {
            expect(res.body)
              .to.have.property('user')
              .to.have.property('email')
              .to.be.equal(DEFAULT_ADMIN.email)
            expect(res.body).to.have.property('role')
            expect(res.body).to.have.property('profile')
            expect(res.body).to.have.property('isMedic')
            expect(res.body).to.have.property('medic')
          })
      })
  })
})

describe(message.noAccess('Account'), () => {
  it('PUT    =>  /api/account/user/{id}/password', async () => {
    await client.put('/api/account/user/1/password').expect(401)
  })
  it('PUT    =>  /api/account/password', async () => {
    await client.put('/api/account/password').expect(401)
  })

  it('DELETE =>  /api/account/user/{id}', async () => {
    await client.delete('/api/account/user/1').expect(401)
  })
})
