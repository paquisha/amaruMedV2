<template>
  <v-row align="center" justify="center" style="height: 100%">
    <div class="layout column row align-center">
      <v-img :width="width" src="@/assets/empty.svg" />
      <h4 class="grey--text text--lighten-1">{{ title }}</h4>
    </div>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component({})
export default class EmptyComponent extends Vue {
  @Prop({ default: 'Sin contenido' }) title!: string
  @Prop({ default: 200 }) width!: number
}
</script>
