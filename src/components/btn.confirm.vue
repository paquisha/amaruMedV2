<template>
  <v-btn :disabled="disabled" v-if="!clicked" icon @click="onFirstClick()">
    <v-icon :color="color" :small="small">{{ icon }}</v-icon>
  </v-btn>
  <v-tooltip bottom v-else color="warning">
    <template v-slot:activator="{ on, attrs }">
      <v-btn @click="onConfirmedClick()" color="warning" v-bind="attrs" v-on="on" icon>
        <v-icon :small="small">{{ icon }}</v-icon>
      </v-btn>
    </template>
    <span>Haga clic para confirmar.</span>
  </v-tooltip>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Emit, Watch } from 'vue-property-decorator'
@Component({ name: 'del-btn' })
export default class ConfirmButton extends Vue {
  @Prop({ default: false }) disabled!: boolean
  @Prop({ default: false }) small!: boolean
  @Prop({ default: 'fa-trash' }) icon!: string
  @Prop() color!: string

  private clicked: boolean = false
  private tooltip: boolean = false
  onFirstClick() {
    this.clicked = true
    setTimeout(() => {
      this.tooltip = true
    }, 500)
    setTimeout(() => {
      this.clicked = false
    }, 3000)
  }
  @Emit('click:confirm')
  onConfirmedClick() {
    this.clicked = false
    return null
  }
}
</script>
