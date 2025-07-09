// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { MyJWTService } from '../../services/jwt.service'
import { DEFAULT_ADMIN_ROLE } from '../../migrations'
import { UserRepository } from '../../repositories'
import { TOKEN } from '../../configs/env'
import { message } from '../../utils'
import { random } from '../../utils'
import { Profile } from '../../models'
import { Role } from '../../models'
import { User } from '../../models'

describe(message.integrated('Account'), () => {
  let app: Application
  let client: Client
  let session: User
  let token: string
  let userRepo: UserRepository
  let testToken: string
  let testModel: User

  before('setupApplication', async () => {
    ;({ app, client, token, session } = await setupApplicationWithToken())
    userRepo = await app.getRepository(UserRepository)
  })

  after(async () => {
    await app.stop()
  })

  it('Create an account', async () => {
    let role: Role = new Role()
    let profile: Profile = new Profile()

    // load role admin
    await client
      .get('/api/roles')
      .auth(token, { type: 'bearer' })
      .query({ filter: { where: { name: DEFAULT_ADMIN_ROLE.name } } })
      .expect(200)
      .then(({ body }) => (role = new Role(body[0])))

    // create a user profile
    await client
      .post('/api/profile')
      .send({
        lastName: `test.ln${Date.now()}`,
        firstName: `test.fn${Date.now()}`,
        address: `test.address${Date.now()}`,
        email: random.email()
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(({ body }) => (profile = new Profile(body)))

    // create an user account
    await client
      .post(`/api/profile/${profile.id}/user`)
      .send({
        email: profile.email,
        roleId: role?.id,
        profileId: profile.id
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(({ body }) => (testModel = new User(body)))
  })

  it('Activate an account', async () => {
    const { verificationToken } = await userRepo.findById(testModel.id, {
      fields: { verificationToken: true }
    })
    await client
      .post(`/api/account/activate`)
      .send({
        token: verificationToken,
        password: 'MyN3wP4$'
      })
      .expect(200)
      .then(async ({ body }) => {
        testToken = body.token
        expect(body).to.have.property('token').to.be.String()
        expect(body).to.have.property('expiresAt').to.be.Number()
        const result = await userRepo.findById(testModel.id)
        expect(result.emailVerified).to.be.true()
        expect(result.verificationToken).to.be.Null()
      })
  })

  it('Reset account password per session', async () => {
    await client
      .put('/api/account/password')
      .send({
        currentPassword: 'MyN3wP4$',
        newPassword: 'MyN3wP4$$'
      })
      .auth(testToken, { type: 'bearer' })
      .expect(204)
      .then(async () => {
        const result = await userRepo.findById(testModel.id)
        expect(result.passResetToken).to.be.Null()
      })

    await client
      .post('/api/account/login')
      .send({
        email: testModel.email,
        password: 'MyN3wP4$$'
      })
      .expect(200)
  })

  it('Reset account password with token', async () => {
    // simulate send email with token
    const passResetToken = await new MyJWTService(TOKEN.secret).generateToken(
      testModel.email,
      600
    )
    await userRepo.updateById(testModel.id, { passResetToken })
    await client
      .put('/api/account/restore')
      .send({
        token: passResetToken,
        password: 'MyN3wP4$$Word'
      })
      .auth(testToken, { type: 'bearer' })
      .expect(200)
      .then(async ({ body }) => {
        const result = await userRepo.findById(testModel.id)
        expect(result.passResetToken).to.be.Null()
        expect(body).to.have.property('token').to.be.not.null()
      })

    await client
      .post('/api/account/login')
      .send({
        email: testModel.email,
        password: 'MyN3wP4$$Word'
      })
      .expect(200)
  })

  it("Restore a user's password", async () => {
    await client
      .put(`/api/account/user/${testModel.id}/password`)
      .send({ password: 'MyN3wP4$$w' })
      .auth(token, { type: 'bearer' })
      .expect(204)
      .then(async () => {
        const result = await userRepo.findById(testModel.id)
        expect(result.passResetToken).to.be.Null()
      })

    await client
      .post('/api/account/login')
      .send({
        email: testModel.email,
        password: 'MyN3wP4$$w'
      })
      .expect(200)
  })

  it('Change to deleted status', async () => {
    await client
      .delete(`/api/account/user/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
      .then(async () => {
        const result = await userRepo.findById(testModel.id)
        expect(result.deleted).to.be.true()
        expect(result.deletedBy).to.be.eql(session.id)
        expect(result.deletedAt).to.be.not.null()
      })
  })

  it('Delete forever', async () => {
    await userRepo.updateById(testModel.id, { emailVerified: false })
    await client
      .delete(`/api/account/user/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
  })
})
