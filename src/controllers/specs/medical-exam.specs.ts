// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { responsePatchCountSchema } from './CRUDSpecs'
import { getModelSchemaRef } from '@loopback/rest'
import { responseSimpleSchema } from './CRUDSpecs'
import { RequestBodyObject } from '@loopback/rest'
import { responseCountSchema } from './CRUDSpecs'
import { OperationObject } from '@loopback/rest'
import { responseListSchema } from './CRUDSpecs'
import { responseOneSchema } from './CRUDSpecs'
import { requestBodySchema } from './CRUDSpecs'
import { CRUDSpecScheme } from './CRUDSpecs'
import { MedicalExam } from '../../models'

class MedicalExamCRUDSpecs implements CRUDSpecScheme {
  /**
   * Specifications to request a body.
   */
  requestBody(): RequestBodyObject {
    return {
      content: {
        'application/json': {
          schema: {
            type: 'array',
            description: 'disease id',
            items: getModelSchemaRef(MedicalExam, {
              exclude: [
                'createdAt',
                'createdBy',
                'editedAt',
                'editedBy',
                'deleted',
                'deletedAt',
                'deletedBy',
                'id',
                'medicalRecordId'
              ]
            })
          }
        }
      }
    }
  }

  /**
   * Specifications to request partial body.
   */
  requestPartialBoby(): RequestBodyObject {
    return requestBodySchema(MedicalExam, {
      partial: true,
      exclude: [
        'createdAt',
        'createdBy',
        'editedAt',
        'editedBy',
        'deleted',
        'deletedAt',
        'deletedBy',
        'id'
      ]
    })
  }

  /**
   * Specifications to response total of medical exams.
   */
  responseCount(description?: string): OperationObject {
    return responseCountSchema(MedicalExam, description)
  }

  /**
   * Specifications to response one medical exam.
   */
  responseOne(description?: string, includeRelations?: boolean): OperationObject {
    return responseOneSchema(
      MedicalExam,
      {
        includeRelations,
        exclude: []
      },
      description
    )
  }

  /**
   * Specifications to response one medical exam whitout relations.
   */
  responseOneSimple(description?: string): OperationObject {
    return responseOneSchema(MedicalExam, undefined, description)
  }

  /**
   * Specifications to response array of medical exams.
   */
  responseList(description?: string): OperationObject {
    return responseListSchema(MedicalExam, { includeRelations: true }, description)
  }

  /**
   * Specifications to response count of medical exams updates.
   */
  responsePatchCount(description?: string): OperationObject {
    return responsePatchCountSchema(MedicalExam, description)
  }

  /**
   * Specifications to response 204 status.
   * @param method methods allowed PATCH, PUT, DELETE
   */
  responseSimple(
    method: 'PATCH' | 'PUT' | 'DELETE',
    description?: string
  ): OperationObject {
    return responseSimpleSchema(MedicalExam, method, description)
  }
}

export default new MedicalExamCRUDSpecs()
