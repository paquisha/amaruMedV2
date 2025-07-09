// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Client, expect } from '@loopback/testlab'
import { Application } from '../..'
import { setupApplicationWithToken } from '../init/setup.spec'
import { PermissionRepository } from '../../repositories'
import { RoleRepository } from '../../repositories'
import { OPTION } from '../../migrations'
import { Permission } from '../../models'
import { Role } from '../../models'
import { User } from '../../models'
import { message, random } from '../../utils'

let app: Application
let client: Client
let token: string
let session: User
let testModel: Permission
let roleModel: Role

const clearUpdated = async () => {
  const repo = await app.getRepository(PermissionRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}

const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(PermissionRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
  // create a role
  const roleRepo = await app.getRepository(RoleRepository)
  roleModel = await roleRepo.create({
    createdAt: new Date().toLocaleString(),
    createdBy: session.id,
    name: random.string(5),
    description: 'test'
  })
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('Permission'), () => {
  it('POST    =>  /api/permission', async () => {
    await client
      .post('/api/permission')
      .send({
        create: true,
        read: true,
        edit: true,
        del: true,
        roleId: roleModel.id,
        moduleId: OPTION.id
      })
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
        expect(res.body).to.have.property('createdBy').to.be.equal(session.id)
        // element created
        testModel = res.body
      })
  })

  it('GET     =>  /api/permissions/count', async () => {
    await client
      .get('/api/permissions/count')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/permissions', async () => {
    await client
      .get('/api/permissions')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/permissions', async () => {
    await client
      .patch('/api/permissions')
      .auth(token, { type: 'bearer' })
      .query({ where: { id: testModel.id } })
      .send({ del: false })
      .expect(200)
      .then(async res => {
        expect(res.body).to.have.property('count').to.be.Number()
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('GET     =>  /api/permission/{id}', async () => {
    await client
      .get(`/api/permission/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })

  it('PATCH   =>  /api/permission/{id}', async () => {
    await client
      .patch(`/api/permission/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ create: false })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('DELETE  =>  /api/permission/{id}', async () => {
    await client
      .delete(`/api/permission/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(204)
      .then(async () => {
        const roleRepo = await app.getRepository(RoleRepository)
        await roleRepo.deleteById(roleModel.id)
      })
  })
})

describe(message.noAccess('Permission'), () => {
  it('POST    =>  /api/permission', async () => {
    await client.post('/api/permission').expect(401)
  })

  it('GET     =>  /api/permissions/count', async () => {
    await client.get('/api/permissions').expect(401)
  })

  it('GET     =>  /api/permissions', async () => {
    await client.get('/api/permissions').expect(401)
  })

  it('PATCH   =>  /api/permissions', async () => {
    await client.patch('/api/permissions').expect(401)
  })

  it('GET     =>  /api/permission/{id}', async () => {
    await client.get('/api/permission/1').expect(401)
  })

  it('PATCH   =>  /api/permission/{id}', async () => {
    await client.patch('/api/permission/1').expect(401)
  })

  it('DELETE  =>  /api/permission/{id}', async () => {
    await client.delete('/api/permission/1').expect(401)
  })
})
