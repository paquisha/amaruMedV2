// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Component from 'vue-class-component'
import { createMedic } from '@/models'
import { Medic } from '@/models'
import { Filter } from '@/utils/query'
import Search from '@/utils/search'
import service from '@/services/MedicService'
import validate from '@/utils/validations'
import alert from '@/utils/alert'

@Component({})
export default class MedicController extends Vue {
  /********************************************************
   *                      Attributes                       *
   ********************************************************/

  // GUI
  private isValidForm = false
  private form: boolean = false
  private headers: object[] = [
    { text: 'Image', value: 'image' },
    { text: 'Nombres', value: 'firstName' },
    { text: 'Cédula', value: 'dni' },
    { text: 'Pasaporte', value: 'passport' },
    { text: 'Registro profesional', value: 'regProfessional' },
    { text: 'Móvil', value: 'mobile' },
    { text: 'Email', value: 'email' },
    { text: 'Acciones', value: 'actions', align: 'right' }
  ]

  // Element data
  private elements: Medic[] = []
  private elementIndex = -1
  private element: Medic = createMedic()

  // Validations
  private rules: object = {
    required: [(v: string) => validate.required(v)],
    email: [(v: string) => validate.isEmail(v)],
    dni: [(v: string) => validate.isDni(v)],
    passport: [],
    telephone: [(v: string) => validate.isTelephone(v)],
    mobile: [(v: string) => validate.isMobile(v)]
  }

  /********************************************************
   *                     Initializable                     *
   ********************************************************/

  async beforeMount(): Promise<void> {
    this.findElements()
    await this.$store.dispatch('loadOptions')
  }

  /********************************************************
   *                    API Services                       *
   ********************************************************/

  async findElements(search?: Search): Promise<void> {
    const filter: Filter<Medic> = { limit: 25, where: { deleted: false } }
    if (search) {
      filter.where = {
        and: [
          // undefined to find all profiles and false to find not deleted profiles.
          { deleted: search.includeRemoveds ? undefined : false },
          {
            or: [
              { dni: { ilike: `%${search.value}%` } },
              { passport: { ilike: `%${search.value}%` } },
              { firstName: { ilike: `%${search.value}%` } },
              { lastName: { ilike: `%${search.value}%` } },
              { regProfessional: { ilike: `%${search.value}%` } }
            ]
          }
        ]
      }
    }
    service.find(filter).then(res => {
      this.elements = res
    })
  }

  async updateElement(): Promise<void> {
    service
      .updateById(this.element.id, {
        dni: this.element.dni?.replace('-', ''),
        passport: this.element.passport,
        lastName: this.element.lastName,
        firstName: this.element.firstName,
        telephone: this.element.telephone,
        mobile: this.element.mobile,
        email: this.element.email,
        address: this.element.address,
        regProfessional: this.element.regProfessional
      })
      .then(() => {
        ;(this.element.dni = this.element.dni?.replace('-', '')),
          Object.assign(this.elements[this.elementIndex], this.element)
        alert.onUpdateSuccess('Paciente actualizado')
      })
      .catch(err => alert.onUpdateError(err, 'paciente'))
  }

  async updateImage(url: string): Promise<void> {
    service
      .updateById(this.element.id, { image: url })
      .then(() => {
        this.element.image = url
        Object.assign(this.elements[this.elementIndex], this.element)
        alert.success('Imagen cargada')
      })
      .catch(() => alert.error('Error ', 'Error al subir imagen'))
  }

  async deleteElement(element: Medic): Promise<void> {
    await service
      .delete(element.id)
      .then(() => {
        this.elements.splice(this.elements.indexOf(element), 1)
        alert.onDeleteSuccess('Registro de paciente eliminado')
      })
      .catch(err =>
        alert.onDeleteError(err, 'No se pudo eliminar el registro de paciente')
      )
  }

  async submit(): Promise<void> {
    // eslint-disable-next-line
    //@ts-expect-error
    await this.$refs.form.validate()
    if (this.isValidForm === true) {
      if (this.elementIndex > -1) await this.updateElement()
    }
  }

  /********************************************************
   *                       Methods                         *
   ********************************************************/

  toEditElement(element: Medic): void {
    this.elementIndex = this.elements.indexOf(element)
    this.element = Object.assign({}, element)
    this.form = true
  }

  showLog(element: Medic) {
    //@ts-ignore
    this.$launchLog(element, {
      title: 'paciente',
      msg: `${element.lastName} ${element.firstName}`
    })
  }

  reset(): void {
    this.elementIndex = -1
    this.element = createMedic()
    this.form = false
    //@ts-expect-error
    this.$refs.form.reset()
  }
}
