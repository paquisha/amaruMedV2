<template>
  <v-text-field
    color="primary"
    :append-icon="showPwd ? 'fa-eye-slash' : 'fa-eye'"
    @click:append="onAppendIconClick()"
    :type="showPwd ? 'text' : 'password'"
    :outlined="outlined"
    :dense="dense"
    :label="label"
    :rules="rules"
    :value="value"
    :error="showError"
    :error-messages="error"
    @input="input"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Emit } from 'vue-property-decorator'

@Component({ name: 'v-password-field' })
export default class PasswordField extends Vue {
  @Prop() value!: number
  @Prop() time!: number
  @Prop({ default: 'Contraseña' }) label!: string
  @Prop({ default: false }) outlined!: boolean
  @Prop({ default: false }) dense!: boolean
  @Prop() error!: string
  @Prop() rules!: object[]

  private showPwd: boolean = false

  onAppendIconClick() {
    this.showPwd = !this.showPwd
    if (this.time && this.showPwd) {
      setTimeout(() => {
        this.showPwd = false
      }, this.time)
    }
  }

  get showError(): boolean {
    return this.error !== undefined && this.error !== ''
  }

  @Emit('input')
  input(value: string): string {
    return value
  }
}
</script>
