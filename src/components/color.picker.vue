<template>
  <v-text-field
    color="primary"
    :label="label"
    @input="input"
    v-mask="['!#XXXXXX']"
    :rules="rules"
    required
    :value="value"
    outlined
    dense
  >
    <template v-slot:prepend><div :style="color" /></template>
    <template v-slot:append>
      <v-menu :close-on-content-click="false" v-model="menu" offset-y>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">fas fa-eye-dropper</v-icon>
        </template>
        <v-card>
          <v-card-text class="pa-0">
            <v-color-picker :value="value" @input="input" flat />
          </v-card-text>
        </v-card>
      </v-menu> </template
  ></v-text-field>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Emit } from 'vue-property-decorator'
//import { Bootable } from '@loopback/boot'

@Component({ name: 'color-picker' })
export default class ColorPicker extends Vue {
  @Prop() value!: number
  @Prop() label!: string

  private menu: boolean = false
  private rules: object[] = [
    (v: string) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v) || 'No es color'
  ]

  @Emit('input')
  input(value: string): string {
    return value
  }

  get color() {
    const { value, menu } = this
    return {
      backgroundColor: value,
      marginTop: '-5px',
      height: '35px',
      width: '35px',
      borderRadius: menu ? '50%' : '4px',
      transition: 'border-radius 200ms ease-in-out'
    }
  }
}
</script>
