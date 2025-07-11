// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import service from '@/services/DiseaseService'
import { Watch } from 'vue-property-decorator'
import Component from 'vue-class-component'
import validate from '@/utils/validations'
import { createDisease } from '@/models'
import { Disease } from '@/models'
import alert from '@/utils/alert'
import Search from '@/utils/search'
import { Filter } from '@/utils/query'

@Component({})
export default class DiseaseController extends Vue {
  /********************************************************
   *                      Attributes                       *
   ********************************************************/

  // GUI
  private headers: object[] = []
  private isValidForm = false
  private dialog = false
  private search: string = ''

  // Element data
  private diseaseTypeId: number = 0
  private elements: Disease[] = []
  private elementIndex = -1
  private element: Disease = createDisease()

  // Validations
  private rules: object = {
    code: [(v: string) => validate.maxLength(v, 10)],
    name: [(v: string) => validate.required(v)]
  }

  /********************************************************
   *                     Initializable                     *
   ********************************************************/

  async beforeMount(): Promise<void> {
    this.diseaseTypeId = Number(this.$route.params.id)
    await this.findElements(this.diseaseTypeId)
    this.headers = [
      { text: 'Código', value: 'code' },
      { text: 'Nombre', value: 'name' },
      { text: 'Descripción', value: 'description' },
      { text: 'Actions', value: 'actions', sortable: false, align: 'end' }
    ]
  }

  /********************************************************
   *                    API Services                       *
   ********************************************************/
  async createElement(): Promise<void> {
    await service
      .create(this.diseaseTypeId, this.element)
      .then(element => {
        this.elements.push(element)
        alert.onCreateSuccess('Enfermedad registrada')
      })
      .catch(err => alert.onCreateError(err, 'enfermedad'))
  }

  async findElements(diseaseTypeId: number, search?: Search): Promise<void> {
    const filter: Filter<Disease> = { limit: 25, where: { deleted: false } }
    if (search) {
      filter.where = {
        and: [
          // undefined to find all profiles and false to find not deleted profiles.
          { deleted: search.includeRemoveds ? undefined : false },
          {
            or: [
              { code: { ilike: `%${search.value}%` } },
              { name: { ilike: `%${search.value}%` } },
              { description: { ilike: `%${search.value}%` } }
            ]
          }
        ]
      }
    }
    await service
      .findByProfileId(diseaseTypeId, filter)
      .then(list => (this.elements = list))
  }

  async updateElement(): Promise<void> {
    await service
      .updateById(this.element.id, {
        code: this.element.code,
        name: this.element.name,
        description: this.element.description,
        actions: this.element.actions
      })
      .then(() => {
        Object.assign(this.elements[this.elementIndex], this.element)
        alert.onUpdateSuccess('Enfermedad actualizada')
      })
      .catch(err => {
        alert.onUpdateError(err, 'enfermedad')
      })
  }

  async deleteElement(element: Disease): Promise<void> {
    await service
      .delete(element.id)
      .then(() => {
        this.elements.splice(this.elements.indexOf(element), 1)
        alert.onDeleteSuccess('Registro de enfermed eliminado')
      })
      .catch(err =>
        alert.onDeleteError(err, 'No se pudo eliminar el registro de enfermedad')
      )
  }

  async submit(): Promise<void> {
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

  showLog(element: Disease) {
    //@ts-ignore
    this.$launchLog(element, {
      title: 'enfermedad',
      msg: element.name
    })
  }

  toEditElement(element: Disease): void {
    this.elementIndex = this.elements.indexOf(element)
    this.element = Object.assign({}, element)
    this.dialog = true
  }

  reset(): void {
    this.elementIndex = -1
    this.element = createDisease()
    //@ts-expect-error
    this.$refs.form.reset()
    this.dialog = false
  }

  /********************************************************
   *                        Watch                         *
   ********************************************************/
  @Watch('$route.params.id')
  async onDiseaseTypeIdChange(newVal: string, oldVal: string) {
    if (newVal !== oldVal) {
      this.diseaseTypeId = Number(newVal)
      await this.findElements(Number(newVal))
    }
  }
}
