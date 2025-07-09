// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import medRecService from '@/services/MedicalRecordService'
import vsService from '@/services/VitalSignService'
import { createMedicalRecord } from '@/models'
import { Watch } from 'vue-property-decorator'
import Component from 'vue-class-component'
import validate from '@/utils/validations'
import { createVitalSign } from '@/models'
import { MedicalRecord } from '@/models'
import { VitalSign } from '@/models'
import alert from '@/utils/alert'
import Vue from 'vue'

@Component({})
export default class VitalSignController extends Vue {
  /********************************************************
   *                      Attributes                       *
   ********************************************************/

  // GUI
  private isValidForm = false

  // Element data
  private medRec: MedicalRecord = createMedicalRecord()
  private element: VitalSign = createVitalSign()

  // Validations
  private rules: object = {
    required: [(v: string) => validate.required(v)]
  }

  /********************************************************
   *                     Initializable                     *
   ********************************************************/

  async beforeMount(): Promise<void> {}

  /********************************************************
   *                    API Services                       *
   ********************************************************/
  async createElement(): Promise<void> {
    if (!this.medRec.patientId) {
      alert.warning('Advertencia', 'Por favor seleccione un paciente.')
      return
    }
    if (!this.medRec.medicId) {
      alert.warning('Advertencia', 'Por favor seleccione un Medico.')
      return
    }

    await medRecService
      .create(this.medRec.patientId, this.medRec)
      .then(async res => {
        this.medRec = res
        await vsService
          .create(res.id, this.element)
          .then(res => {
            this.element = res
            alert.onCreateSuccess('Signos vitales registrados.')
          })
          .catch(err => {
            alert.onCreateError(err, 'signo vital')
          })
      })
      .catch(err => {
        alert.onCreateError(err, 'registro Medico')
      })
  }

  async submit(): Promise<void> {
    //@ts-expect-error
    await this.$refs.form.validate()
    if (this.isValidForm === true) {
      await this.createElement()
    }
  }

  /********************************************************
   *                       Methods                         *
   ********************************************************/

  showLog(element: VitalSign) {
    //@ts-ignore
    this.launchLog(element, {
      title: 'signo vital',
      msg: 'VitalSign'
    })
  }

  reset(): void {
    this.element = createVitalSign()
    //@ts-expect-error
    this.$refs.form.reset()
    //@ts-expect-error
    this.$refs.medic.clear()
    //@ts-expect-error
    this.$refs.patient.clear()
  }

  get mass(): number {
    let calc: number = 0
    if (this.element.weight && this.element.tall)
      calc = Number(this.element.weight) / Math.pow(Number(this.element.tall) / 100, 2)
    return Math.round(calc * 100) / 100
  }

  @Watch('mass')
  onMassChange(val: number) {
    this.element.mass = String(val)
  }
}
