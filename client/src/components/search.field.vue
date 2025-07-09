<template>
  <v-text-field
    :class="rounded !== false ? 'sf-rounded' : ''"
    @input="onInput"
    @keyup.enter="input()"
    @click:clear="clear()"
    v-model="internalValue"
    autocomplete="off"
    label="Buscar ..."
    class="search-field"
    type="search"
    :value="value"
    clearable
    dense
    solo
  >
    <template v-slot:prepend v-if="filter">
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="secondary" v-bind="attrs" v-on="on" small icon>
            <v-icon small>fa-sliders-h</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-toolbar class="primary lighten-1" dark dense>
            <v-icon class="mr-3" small>fa-sliders-h</v-icon>
            <v-toolbar-title class="subtitle-1">Filtro de busqueda</v-toolbar-title>
          </v-toolbar>

          <v-divider></v-divider>

          <v-list>
            <v-list-item>
              <v-list-item-title>Incluir eliminados</v-list-item-title>
              <v-list-item-action>
                <v-switch v-model="includeRemoveds" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </template>

    <template v-slot:append>
      <v-btn @click="input()" color="secondary" small icon>
        <v-icon small>fa-search</v-icon>
      </v-btn>
    </template>
  </v-text-field>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Emit } from 'vue-property-decorator'
//@ts-ignore
import Search from '@/utils/search'

@Component({})
export default class SearchComponent extends Vue {
  @Prop() value!: string
  @Prop({ default: false }) filter!: boolean
  @Prop({ default: false }) rounded!: boolean

  private internalValue: string | null = ''
  private includeRemoveds: boolean = false

  beforeMount(): void {
    this.internalValue = this.value
  }

  private clear(): void {
    this.internalValue = null
    this.input()
  }

  private onInput(value: string) {
    if (value === '') this.clear()
    if (this.filter === false && value !== '') this.input()
  }

  @Emit('input')
  input(): Search | string | null {
    let value: Search | string | null = null

    if (this.filter) {
      value = this.internalValue
        ? {
            value: this.internalValue,
            includeRemoveds: this.includeRemoveds
          }
        : null
    } else {
      value = this.internalValue ? this.internalValue : null
    }
    return value
  }
}
</script>

<style lang="sass">
.sf-rounded
    border-radius: 30px

.search-field .v-text-field__details
    display: none
</style>
