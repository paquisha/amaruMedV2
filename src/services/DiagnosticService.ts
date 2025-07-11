// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { post } from '@/services/Service'
import { get } from '@/services/Service'
import { Diagnostic, Disease } from '@/models'
import { Filter } from '@/utils/query'

class DiagnosticService {
  /**
   * Create a new diagnostic record.
   * @param id medical record id
   * @param diseases diseases id
   */
  async create(id: number, diagnostics: { diseaseId: number }[]): Promise<Diagnostic> {
    const res = await post(
      { url: '/api/medicalrecord/{id}/diagnostics', params: { id } },
      diagnostics
    )
    const data: Diagnostic = res.json()
    return data
  }

  /**
   * Find diagnostic from medical record.
   * @param id medical record id
   * @param diseases diseases id
   */
  async finfByMedRec(id: number, filter?: Filter<Disease>): Promise<Disease[]> {
    const res = await get(
      { url: '/api/medicalrecord/{id}/diagnostics', params: { id } },
      { filter: JSON.stringify(filter) }
    )
    const data: Disease[] = res.json()
    return data
  }
}

export default new DiagnosticService()
