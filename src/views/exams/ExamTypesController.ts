// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import service from '@/services/ExamTypeService'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { createExamType } from '@/models'
import { ExamType } from '@/models'
import validate from '@/utils/validations'
import { Filter } from '@/utils/query'
import Search from '@/utils/search'
import alert from '@/utils/alert'

@Component({})
export default class ExamTypeController extends Vue {
  /********************************************************
   *                      Attributes                       *
   ********************************************************/

  // GUI
  private isValidForm = false
  private createDialog = false
  private editDialog = false

  // Element data
  private elements: ExamType[] = []
  private elementIndex = -1
  private element: ExamType = createExamType()
  private elementCreator: ExamType = createExamType()
  private elementEditor: ExamType = createExamType()

  // Validations
  private rules: object = {
    required: [(v: string) => validate.required(v)]
  }

  /********************************************************
   *                     Initializable                     *
   ********************************************************/

  async beforeMount(): Promise<void> {
    await this.findElements()

    const examTypeId: number = Number(this.$route.params.id)
    if (examTypeId) {
      const element: ExamType | undefined = this.elements.find(
        element => element.id === examTypeId
      )
      if (element) {
        this.elementIndex = this.elements.indexOf(element)
        this.element = element
      } else {
        await service
          .findById(examTypeId)
          .then(element => {
            this.elements.push(element)
            this.elementIndex = this.elements.indexOf(element)
            this.element = element
          })
          .catch(() => {
            this.$router.push({ name: 'ExamTypes' })
          })
      }
    }
  }

  /********************************************************
   *                    API Services                       *
   ********************************************************/
  async createElement(): Promise<void> {
    //@ts-expect-error
    await this.$refs.form.validate()
    if (this.isValidForm === true) {
      await service
        .create(this.elementCreator)
        .then(async created => {
          this.element = created
          this.elements.push(created)
          this.elementIndex = this.elements.indexOf(created)
          alert.onCreateSuccess('Tipo de enfermedad creado.')
          this.$router.push({ name: 'Exam', params: { id: String(created.id) } })
        })
        .catch(err => alert.onCreateError(err, 'Tipo de enfermedad'))
      this.resetCreator()
    }
  }

  async findElements(search?: Search): Promise<void> {
    const filter: Filter<ExamType> = { limit: 25, where: { deleted: false } }
    if (search) {
      filter.where = {
        and: [
          // undefined to find all exam types and false to find not deleted exam types.
          { deleted: search.includeRemoveds ? undefined : false },
          { name: { ilike: `%${search.value}%` } }
        ]
      }
    }
    await service.find(filter).then(res => (this.elements = res))
  }

  async updateElement(): Promise<void> {
    //@ts-expect-error
    await this.$refs.form.validate()
    if (this.isValidForm === true)
      await service
        .updateById(this.element.id, { name: this.element.name })
        .then(() => {
          Object.assign(this.elements[this.elementIndex], this.elementEditor)
          alert.onUpdateSuccess('Tipo de enfermedad actualizada')
        })
        .catch(err => alert.onUpdateError(err, 'tipo de enfermedad'))
    this.resetEditor()
  }

  async deleteElement(): Promise<void> {
    await service
      .delete(this.element.id)
      .then(() => {
        this.elements.splice(this.elements.indexOf(this.element), 1)
        alert.onDeleteSuccess('Tipo enfermed eliminada.')
        this.$router.push({ name: 'ExamTypes' })
      })
      .catch(err => alert.onDeleteError(err, 'No se pudo eliminar el registro'))
  }

  /********************************************************
   *                       Methods                         *
   ********************************************************/

  showLog() {
    //@ts-ignore
    this.$launchLog(this.element, {
      title: 'tipo de examen',
      msg: this.element.name
    })
  }

  toEdit(): void {
    this.editDialog = true
    Object.assign(this.elementEditor, this.element)
  }

  onSelectElement(element: ExamType): void {
    this.element = Object.assign({}, element)
    this.elementIndex = this.elements.indexOf(element)
    if (Number(this.$route.params.id) !== this.element.id)
      this.$router.push({ name: 'Exam', params: { id: String(element.id) } })
  }

  resetCreator(): void {
    this.elementCreator = createExamType()
    this.createDialog = false
    //@ts-expect-error
    this.$refs.form.reset()
  }

  resetEditor(): void {
    this.editDialog = false
    this.elementEditor = createExamType()
  }

  /********************************************************
   *                        Watch                         *
   ********************************************************/
  @Watch('$route.name')
  async onRouteChange(newVal: string) {
    if (newVal === 'ExamTypes') {
      this.element = createExamType()
      this.elementIndex = -1
      this.resetEditor()
    }
  }
}
