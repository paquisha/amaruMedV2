<template>
  <v-text-field
    v-mask="['####-##-##']"
    :value="internalValue"
    autocomplete="off"
    color="primary"
    :rules="rules"
    @input="input"
    :label="label"
    :min="min"
    :max="max"
    readonly
    outlined
    dense
  >
    <template v-slot:append>
      <v-menu :close-on-content-click="false" v-model="menu" offset-y>
        <template v-slot:activator="{ on }">
          <v-icon v-on="on">fas fa-calendar-alt</v-icon>
        </template>
        <v-card>
          <v-card-text class="pa-0">
            <v-date-picker
              no-title
              :max="new Date().toISOString().substr(0, 10)"
              :value="value"
              @change="input"
              flat
            />
          </v-card-text>
        </v-card>
      </v-menu>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import { log } from 'util'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Emit } from 'vue-property-decorator'

@Component({})
export default class DatePickerComponent extends Vue {
  @Prop() value!: string
  @Prop() label!: string
  @Prop() max!: string
  @Prop() min!: string
  @Prop() rules!: object[]

  private menu: boolean = false
  private internalValue: string | null = ''

  beforeMount(): void {
    this.internalValue = this.value
  }

  @Emit('input')
  input(value: string): string {
    this.internalValue = value
    this.menu = false
    return value
  }
}
</script>
