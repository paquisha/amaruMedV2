// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Count, CountSchema, Filter, repository, Where } from '@loopback/repository'
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody
} from '@loopback/rest'
import { Medic, MedicalRecord } from '../models'
import { MedicRepository } from '../repositories'

export class MedicMedicalRecordController {
  constructor(@repository(MedicRepository) protected medicRepository: MedicRepository) {}

  @get('/medics/{id}/medical-records', {
    responses: {
      '200': {
        description: 'Array of Medic has many MedicalRecord',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(MedicalRecord) }
          }
        }
      }
    }
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<MedicalRecord>
  ): Promise<MedicalRecord[]> {
    return this.medicRepository.medicalRecords(id).find(filter)
  }

  @post('/medics/{id}/medical-records', {
    responses: {
      '200': {
        description: 'Medic model instance',
        content: { 'application/json': { schema: getModelSchemaRef(MedicalRecord) } }
      }
    }
  })
  async create(
    @param.path.number('id') id: typeof Medic.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedicalRecord, {
            title: 'NewMedicalRecordInMedic',
            exclude: ['id'],
            optional: ['medicId']
          })
        }
      }
    })
    medicalRecord: Omit<MedicalRecord, 'id'>
  ): Promise<MedicalRecord> {
    return this.medicRepository.medicalRecords(id).create(medicalRecord)
  }

  @patch('/medics/{id}/medical-records', {
    responses: {
      '200': {
        description: 'Medic.MedicalRecord PATCH success count',
        content: { 'application/json': { schema: CountSchema } }
      }
    }
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedicalRecord, { partial: true })
        }
      }
    })
    medicalRecord: Partial<MedicalRecord>,
    @param.query.object('where', getWhereSchemaFor(MedicalRecord))
    where?: Where<MedicalRecord>
  ): Promise<Count> {
    return this.medicRepository.medicalRecords(id).patch(medicalRecord, where)
  }

  @del('/medics/{id}/medical-records', {
    responses: {
      '200': {
        description: 'Medic.MedicalRecord DELETE success count',
        content: { 'application/json': { schema: CountSchema } }
      }
    }
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(MedicalRecord))
    where?: Where<MedicalRecord>
  ): Promise<Count> {
    return this.medicRepository.medicalRecords(id).delete(where)
  }
}
