<template>
  <v-select
    @change="input"
    item-text="name"
    item-value="id"
    :items="elements"
    :label="label"
    :value="value"
    :rules="rules"
    outlined
    dense
  />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Emit } from 'vue-property-decorator'
import { Option } from '@/models'

@Component({})
export default class OptionselectorComponent extends Vue {
  @Prop() value!: number
  @Prop() group!: Group
  @Prop() rules!: object[]

  private elements: Option[] = []

  async beforeMount() {
    await this.$store.dispatch('loadOptions')

    switch (this.group) {
      case 'BloodType':
        this.elements = this.$store.state.option.elements.filter(
          (element: Option) => element.groupId === 1
        )
        break

      case 'CivilStatus':
        this.elements = this.$store.state.option.elements.filter(
          (element: Option) => element.groupId === 2
        )
        break
      case 'Sex':
        this.elements = this.$store.state.option.elements.filter(
          (element: Option) => element.groupId === 3
        )
        break
    }
  }

  get label(): string {
    let myLabel: string = ''
    switch (this.group) {
      case 'BloodType':
        myLabel = 'Tipo de sangre'
        break

      case 'CivilStatus':
        myLabel = 'Estado civil'
        break

      case 'Sex':
        myLabel = 'Sexo'
        break
    }
    return myLabel
  }

  @Emit('input')
  input(value: number): number {
    return value
  }
}

type Group = 'CivilStatus' | 'BloodType' | 'Sex'
</script>
