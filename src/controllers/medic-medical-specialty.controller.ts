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
import { Medic, MedicalSpecialty } from '../models'
import { MedicRepository } from '../repositories'

export class MedicMedicalSpecialtyController {
  constructor(@repository(MedicRepository) protected medicRepository: MedicRepository) {}

  @get('/medics/{id}/medical-specialties', {
    responses: {
      '200': {
        description: 'Array of Medic has many MedicalSpecialty through Specialist',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(MedicalSpecialty) }
          }
        }
      }
    }
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<MedicalSpecialty>
  ): Promise<MedicalSpecialty[]> {
    return this.medicRepository.medicalSpecialties(id).find(filter)
  }

  @post('/medics/{id}/medical-specialties', {
    responses: {
      '200': {
        description: 'create a MedicalSpecialty model instance',
        content: { 'application/json': { schema: getModelSchemaRef(MedicalSpecialty) } }
      }
    }
  })
  async create(
    @param.path.number('id') id: typeof Medic.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedicalSpecialty, {
            title: 'NewMedicalSpecialtyInMedic',
            exclude: ['id']
          })
        }
      }
    })
    medicalSpecialty: Omit<MedicalSpecialty, 'id'>
  ): Promise<MedicalSpecialty> {
    return this.medicRepository.medicalSpecialties(id).create(medicalSpecialty)
  }

  @patch('/medics/{id}/medical-specialties', {
    responses: {
      '200': {
        description: 'Medic.MedicalSpecialty PATCH success count',
        content: { 'application/json': { schema: CountSchema } }
      }
    }
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(MedicalSpecialty, { partial: true })
        }
      }
    })
    medicalSpecialty: Partial<MedicalSpecialty>,
    @param.query.object('where', getWhereSchemaFor(MedicalSpecialty))
    where?: Where<MedicalSpecialty>
  ): Promise<Count> {
    return this.medicRepository.medicalSpecialties(id).patch(medicalSpecialty, where)
  }

  @del('/medics/{id}/medical-specialties', {
    responses: {
      '200': {
        description: 'Medic.MedicalSpecialty DELETE success count',
        content: { 'application/json': { schema: CountSchema } }
      }
    }
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(MedicalSpecialty))
    where?: Where<MedicalSpecialty>
  ): Promise<Count> {
    return this.medicRepository.medicalSpecialties(id).delete(where)
  }
}
