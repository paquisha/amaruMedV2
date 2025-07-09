<template>
  <v-tooltip
    :top="top"
    :right="right"
    :bottom="bottom"
    :left="left"
    color="primary  lighten-1"
    :open-delay="delay"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        @click="$emit('click')"
        :color="color"
        dark="dark"
        v-bind="attrs"
        v-on="tooltip ? on : null"
        :icon="icon"
        :small="small"
        :disabled="disabled"
      >
        <slot name="default" />
      </v-btn>
    </template>
    <span>{{ tooltip }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Emit } from 'vue-property-decorator'

@Component({})
export default class ButtonTooltipComponent extends Vue {
  @Prop() tooltip!: string
  @Prop() icon!: boolean
  @Prop() top!: boolean
  @Prop() right!: boolean
  @Prop() left!: boolean
  @Prop({}) color!: string
  @Prop() disabled!: boolean
  @Prop({ default: false }) dark!: boolean
  @Prop({ default: true }) bottom!: boolean
  @Prop({ default: false }) small!: boolean
  @Prop({ default: 1000 }) delay!: string | number
}
</script>
