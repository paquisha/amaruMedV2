// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Component from 'vue-class-component'
import { createPatient } from '@/models'
import { Patient } from '@/models'
import { Filter } from '@/utils/query'
import Search from '@/utils/search'
import service from '@/services/PatientService'
import validate from '@/utils/validations'
import alert from '@/utils/alert'

@Component({})
export default class PatientController extends Vue {
  /********************************************************
   *                      Attributes                       *
   ********************************************************/

  // GUI
  private isValidForm = false
  private form: boolean = false
  private headers: object[] = [
    { text: 'HC', value: 'hc' },
    { text: 'Apellidos', value: 'lastName' },
    { text: 'Nombres', value: 'firstName' },
    { text: 'Cédula', value: 'dni' },
    { text: 'Pasaporte', value: 'passport' },
    { text: 'Fecha de nacimiento', value: 'birthday' },
    { text: 'Móvil', value: 'mobile' },
    { text: 'Email', value: 'email' },
    { text: 'Acciones', value: 'actions', align: 'right' }
  ]

  // Element data
  private elements: Patient[] = []
  private elementIndex = -1
  private element: Patient = createPatient()

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
  async createElement(): Promise<void> {
    let element: Patient = this.element
    ;(element.birthday = new Date(element.birthday).toISOString()),
      (element.dni = element.dni?.replace('-', ''))
    service
      .create(element)
      .then(async created => {
        this.element = created
        this.elements.push(created)
        this.elementIndex = this.elements.indexOf(created)
        alert.onCreateSuccess('Paciente registrado.')
      })
      .catch(err => alert.onCreateError(err, 'paciente'))
  }

  async findElements(search?: Search): Promise<void> {
    const filter: Filter<Patient> = { limit: 25, where: { deleted: false } }
    if (search) {
      filter.where = {
        and: [
          // undefined to find all profiles and false to find not deleted profiles.
          { deleted: search.includeRemoveds ? undefined : false },
          {
            or: [
              { hc: { ilike: `%${search.value}%` } },
              { dni: { ilike: `%${search.value}%` } },
              { passport: { ilike: `%${search.value}%` } },
              { firstName: { ilike: `%${search.value}%` } },
              { lastName: { ilike: `%${search.value}%` } }
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
        hc: this.element.hc,
        passport: this.element.passport,
        lastName: this.element.lastName,
        firstName: this.element.firstName,
        ocupation: this.element.ocupation,
        birthday: new Date(this.element.birthday).toISOString(),
        telephone: this.element.telephone,
        mobile: this.element.mobile,
        email: this.element.email,
        address: this.element.address,
        blooType: this.element.blooType,
        civilStatus: this.element.civilStatus,
        sex: this.element.sex
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

  async deleteElement(element: Patient): Promise<void> {
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
      else await this.createElement()
    }
  }

  /********************************************************
   *                       Methods                         *
   ********************************************************/

  toEditElement(element: Patient): void {
    this.elementIndex = this.elements.indexOf(element)
    this.element = Object.assign({}, element)
    this.form = true
  }

  showLog(element: Patient) {
    //@ts-ignore
    this.$launchLog(element, {
      title: 'paciente',
      msg: `${element.lastName} ${element.firstName}`
    })
  }

  reset(): void {
    this.elementIndex = -1
    this.element = createPatient()
    this.form = false
    //@ts-expect-error
    this.$refs.form.reset()
  }
}
