// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import service from '@/services/ExamService'
import { Watch } from 'vue-property-decorator'
import Component from 'vue-class-component'
import validate from '@/utils/validations'
import { createExam } from '@/models'
import { Exam } from '@/models'
import alert from '@/utils/alert'

@Component({})
export default class ExamController extends Vue {
  /********************************************************
   *                      Attributes                       *
   ********************************************************/

  // GUI
  private headers: object[] = []
  private isValidForm = false
  private dialog = false
  private search: string = ''

  // Element data
  private examTypeId: number = 0
  private elements: Exam[] = []
  private elementIndex = -1
  private element: Exam = createExam()

  // Validations
  private rules: object = {
    code: [(v: string) => validate.maxLength(v, 10)],
    name: [(v: string) => validate.required(v)]
  }

  /********************************************************
   *                     Initializable                     *
   ********************************************************/

  async beforeMount(): Promise<void> {
    this.examTypeId = Number(this.$route.params.id)
    await this.findElements(this.examTypeId)
    this.headers = [
      { text: 'Nombre', value: 'name' },
      { text: 'Actions', value: 'actions', sortable: false, align: 'end' }
    ]
  }

  /********************************************************
   *                    API Services                       *
   ********************************************************/
  async createElement(): Promise<void> {
    await service
      .create(this.examTypeId, this.element)
      .then(element => {
        this.elements.push(element)
        alert.onCreateSuccess('Enfermedad registrada')
      })
      .catch(err => alert.onCreateError(err, 'enfermedad'))
  }

  async findElements(examTypeId: number): Promise<void> {
    await service
      .findByProfileId(examTypeId, { where: { deleted: false } })
      .then(list => (this.elements = list))
  }

  async updateElement(): Promise<void> {
    await service
      .updateById(this.element.id, {
        name: this.element.name
      })
      .then(() => {
        Object.assign(this.elements[this.elementIndex], this.element)
        alert.onUpdateSuccess('Enfermedad actualizada')
      })
      .catch(err => {
        alert.onUpdateError(err, 'enfermedad')
      })
  }

  async deleteElement(element: Exam): Promise<void> {
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

  showLog(element: Exam) {
    //@ts-ignore
    this.$launchLog(element, {
      title: 'Examen',
      msg: element.name
    })
  }

  toEditElement(element: Exam): void {
    this.elementIndex = this.elements.indexOf(element)
    this.element = Object.assign({}, element)
    this.dialog = true
  }

  reset(): void {
    this.elementIndex = -1
    this.element = createExam()
    //@ts-expect-error
    this.$refs.form.reset()
    this.dialog = false
  }

  /********************************************************
   *                        Watch                         *
   ********************************************************/
  @Watch('$route.params.id')
  async onExamTypeIdChange(newVal: string, oldVal: string) {
    if (newVal !== oldVal) {
      this.examTypeId = Number(newVal)
      await this.findElements(Number(newVal))
    }
  }
}
