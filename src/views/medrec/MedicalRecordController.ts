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
import { Watch } from 'vue-property-decorator'

import List from './MedicalRecordList.vue'
import Preview from './MedRecPreview.vue'
import PatientInfo from './PatientInfo.vue'
import Antecedent from './Antecedent.vue'

@Component({ components: { List, PatientInfo, Preview, Antecedent } })
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
    { text: 'Motivo', value: 'reason' },
    { text: 'Finalizada', value: 'done' },
    { text: 'Cancelada', value: 'canceled' },
    { text: 'Acciones', value: 'actions', align: 'right' }
  ]

  // Element data
  private patientId: number = 0
  private elementIndex = -1
  private elements: MedicalRecord[] = []
  private element: MedicalRecord = createMedicalRecord()

  // Validations
  private rules: object = {}

  /********************************************************
   *                     Initializable                     *
   ********************************************************/

  async beforeMount(): Promise<void> {
    this.patientId = Number(this.$route.params.id)
    this.findElements()
  }

  /********************************************************
   *                    API Services                       *
   ********************************************************/
  async createElement(): Promise<void> {}

  async findElements(search?: Search): Promise<void> {
    service.findByPatientId(this.patientId).then(res => {
      this.elements = res
    })
  }

  async updateElement(): Promise<void> {}

  async deleteElement(element: MedicalRecord): Promise<void> {
    /*await service
      .delete(element.id)
      .then(() => {
        this.elements.splice(this.elements.indexOf(element), 1)
        alert.onDeleteSuccess('Registro de  eliminado.')
      })
      .catch(err =>
        alert.onDeleteError(err, 'No se pudo eliminar el registro de .')
      )*/
  }

  async submit(): Promise<void> {
    // eslint-disable-next-line
    //@ts-expect-error
    await this.$refs.form.validate()
    if (this.isValidForm === true) {
      if (this.elementIndex > -1) await this.updateElement()
      else await this.createElement()
      this.reset()
    }
  }

  /********************************************************
   *                       Methods                         *
   ********************************************************/

  toShowElement(element: MedicalRecord): void {
    this.elementIndex = this.elements.indexOf(element)
    this.element = Object.assign({}, element)
    this.form = true
  }

  showLog(element: MedicalRecord) {
    //@ts-ignore
    this.$launchLog(element, {
      title: '',
      msg: 'MedicalRecord'
    })
  }

  reset(): void {
    this.elementIndex = -1
    this.element = createMedicalRecord()
    this.form = false

    // this.$refs.form.reset()
  }

  /********************************************************
   *                        Watch                         *
   ********************************************************/
  @Watch('$route.params.id')
  onPatientIdChange(newVal: string, oldVal: string) {
    if (newVal !== oldVal) {
      this.patientId = Number(newVal)
      this.findElements()
    }
  }
}
