// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { setupApplicationWithToken } from '../init/setup.spec'
import { MedicRepository } from '../../repositories'
import { Client, expect } from '@loopback/testlab'
import { createMedic } from '../init/init.medic.spec'
import { delMedic } from '../init/init.medic.spec'
import { message } from '../../utils'
import { random } from '../../utils'
import { Medic } from '../../models'
import { Application } from '../..'
import { User } from '../../models'

let app: Application
let client: Client
let token: string
let session: User
let testModel: Medic

const clearUpdated = async () => {
  const repo = await app.getRepository(MedicRepository)
  await repo.updateById(testModel.id, { editedAt: undefined, editedBy: undefined })
}

const wasEdited = async (): Promise<boolean> => {
  const repo = await app.getRepository(MedicRepository)
  const result = await repo.findById(testModel.id)
  return result.editedAt !== null && result.editedBy === session.id
}

before('setupApplication', async () => {
  ;({ app, client, token, session } = await setupApplicationWithToken())
})

after(async () => {
  await app.stop()
})

describe(message.withAccess('Medic'), () => {
  it('POST    =>  /api/user/{id}/medic', async () => {
    await createMedic(client, token).then(res => {
      expect(res).to.have.property('createdAt').to.be.not.null()
      expect(res).to.have.property('createdBy').to.be.equal(session.id)
      // element created
      testModel = res
    })
  })

  it('GET     =>  /api/user/{id}/medic', async () => {
    await client
      .get(`/api/user/${testModel.userId}/medic`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })

  it('GET     =>  /api/medics/count', async () => {
    await client
      .get('/api/medics/count')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('count').to.be.Number()
      })
  })

  it('GET     =>  /api/medics', async () => {
    await client
      .get('/api/medics')
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an.Array()
      })
  })

  it('PATCH   =>  /api/medics', async () => {
    await client
      .patch('/api/medics')
      .auth(token, { type: 'bearer' })
      .query({ where: { id: testModel.id } })
      .send({ regProfessional: random.string(5) })
      .expect(200)
      .then(async res => {
        expect(res.body).to.have.property('count').to.be.Number().to.be.eql(1)
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('GET     =>  /api/medic/{id}', async () => {
    await client
      .get(`/api/medic/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .expect(200)
      .then(res => {
        expect(res.body).to.have.property('createdAt').to.be.not.null()
      })
  })

  it('PATCH   =>  /api/medic/{id}', async () => {
    await client
      .patch(`/api/medic/${testModel.id}`)
      .auth(token, { type: 'bearer' })
      .send({ regProfessional: random.string(5) })
      .expect(204)
      .then(async () => {
        expect(await wasEdited()).to.be.eql(true)
        await clearUpdated()
      })
  })

  it('DELETE  =>  /api/medic/{id}', async () => {
    await delMedic(client, token, testModel)
  })
})

describe(message.noAccess('Medic'), () => {
  it('POST    =>  /api/user/{id}/medic', async () => {
    await client.post('/api/user/1/medic').expect(401)
  })

  it('GET     =>  /api/user/{id}/medic', async () => {
    await client.get('/api/user/1/medic').expect(401)
  })

  it('GET     =>  /api/medics/count', async () => {
    await client.get('/api/medics').expect(401)
  })

  it('GET     =>  /api/medics', async () => {
    await client.get('/api/medics').expect(401)
  })

  it('PATCH   =>  /api/medics', async () => {
    await client.patch('/api/medics').expect(401)
  })

  it('GET     =>  /api/medic/{id}', async () => {
    await client.get('/api/medic/1').expect(401)
  })

  it('PATCH   =>  /api/medic/{id}', async () => {
    await client.patch('/api/medic/1').expect(401)
  })

  it('DELETE  =>  /api/medic/{id}', async () => {
    await client.delete('/api/medic/1').expect(401)
  })
})
