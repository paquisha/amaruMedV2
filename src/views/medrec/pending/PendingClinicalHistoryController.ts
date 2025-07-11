// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Component from 'vue-class-component'
import service from '@/services/MedicalRecordService'
import { createMedicalRecord } from '@/models'
import { MedicalRecord } from '@/models'
import Search from '@/utils/search'
import alert from '@/utils/alert'
import PatientInfo from '../PatientInfo.vue'
import Antecedent from '../Antecedent.vue'
import VitalSign from './VitalSign.vue'
import Diagnostics from './Diagnostics.vue'
import Exams from './Exams.vue'
import Reason from './Reason.vue'
import Cros from './Cros.vue'
import Rpe from './Rpe.vue'

@Component({
  components: {
    PatientInfo,
    Antecedent,
    Diagnostics,
    VitalSign,
    Reason,
    Exams,
    Cros,
    Rpe
  }
})
export default class MedicalRecordController extends Vue {
  /********************************************************
   *                      Attributes                       *
   ********************************************************/

  // GUI
  private isValidForm = false
  private form: boolean = false
  private step: number = 1
  private tab: number = 0
  private headers: object[] = [
    { text: 'Fecha de creación', value: 'createdAt' },
    { text: 'Finalizada', value: 'done', align: 'center' },
    { text: 'Acciones', value: 'actions', align: 'right' }
  ]

  // Element data
  private elements: MedicalRecord[] = []
  private elementIndex = -1
  private element: MedicalRecord = createMedicalRecord()

  /********************************************************
   *                     Initializable                     *
   ********************************************************/

  async beforeMount(): Promise<void> {
    this.findElements()
  }

  /********************************************************
   *                    API Services                       *
   ********************************************************/

  async findElements(search?: Search): Promise<void> {
    if (this.$store.state.session.isMedic)
      await service
        .find({
          order: ['id ASC'],
          where: {
            and: [
              { done: false },
              { canceled: false },
              { medicId: this.$store.state.session.medic.id }
            ]
          }
        })
        .then(res => {
          this.elements = res
        })
  }
  async cancel(element: MedicalRecord): Promise<void> {
    await service
      .updateById(element.id, { canceled: true })
      .then(() => {
        this.elements.splice(this.elements.indexOf(element), 1)
      })
      .catch(err => {
        alert.error('Error al cancelar.', JSON.stringify(err))
      })
  }

  async finish(): Promise<void> {
    await service
      .updateById(this.element.id, { done: true })
      .then(() => {
        this.elements.splice(this.elements.indexOf(this.element), 1)
        alert.success('Completado con éxito.')
      })
      .catch(err => {
        alert.error('Error al cancelar.', JSON.stringify(err))
      })
    this.reset()
  }

  /********************************************************
   *                       Methods                         *
   ********************************************************/

  async toEditElement(element: MedicalRecord): Promise<void> {
    this.elementIndex = this.elements.indexOf(element)
    this.element = Object.assign({}, element)

    this.form = true
  }

  showLog(element: MedicalRecord) {
    //@ts-ignore
    this.$launchLog(element, {
      title: '',
      msg: 'Historial '
    })
  }

  reset(): void {
    this.elementIndex = -1
    this.element = createMedicalRecord()
    this.step = 1
    this.form = false
  }
}
