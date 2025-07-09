<template>
  <v-menu :close-on-content-click="false" v-model="menu" offset-y max-height="275">
    <template v-slot:activator="{ on }">
      <v-text-field
        @keydown="menu = false"
        @keyup.enter="findElements"
        label="Buscar paciente ..."
        autocomplete="off"
        v-model="search"
        hide-details
        clearable
        v-on="on"
        dense
        solo
      >
        <template v-slot:append>
          <v-btn @click="findElements()" color="secondary" small icon>
            <v-icon small>fa-search</v-icon>
          </v-btn>
        </template>
      </v-text-field>

      <v-list-item v-if="element !== null" v-show="element.id > 0">
        <v-list-item-avatar>
          <img :src="element.image || require('@/assets/user.svg')" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="`${element.lastName} ${element.firstName}`" />
          <v-list-item-subtitle v-if="element.dni" v-text="`CI: ${element.dni}`" />
          <v-list-item-subtitle v-else v-text="`Pasaporte: ${element.passport}`" />
          <v-list-item-subtitle v-text="`HC: ${element.hc}`" />
        </v-list-item-content>

        <v-list-item-action>
          <own-btn tooltip="Remover" @click="clear()" icon>
            <v-icon color="secondary lighten-2">far fa-times-circle</v-icon>
          </own-btn>
        </v-list-item-action>
      </v-list-item>
    </template>

    <v-list subheader dense v-if="elements.length > 0">
      <v-list-item v-for="item in elements" :key="item.id" @click="input(item)">
        <v-list-item-avatar>
          <img :src="item.image || require('@/assets/user.svg')" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-text="`${item.lastName} ${item.firstName}`" />
          <v-list-item-subtitle v-if="item.dni" v-text="`CI: ${item.dni}`" />
          <v-list-item-subtitle v-else v-text="`Pasaporte: ${item.passport}`" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Emit } from 'vue-property-decorator'
import { Watch } from 'vue-property-decorator'
import service from '@/services/PatientService'

@Component({})
export default class SearchPatientComponent extends Vue {
  @Prop() value!: object
  @Prop() loadById!: number
  @Prop() return!: string
  private menu: boolean = false
  private loading: boolean = false
  private search: string = ''
  private element: any = {}
  private elements: any[] = []

  beforeMount(): void {
    if (this.loadById) this.findById(this.loadById)
  }

  async findElements(): Promise<void> {
    this.loading = true
    await service
      .find({
        limit: 10,
        where: {
          and: [
            { deleted: false },
            {
              or: [
                { dni: { ilike: `%${this.search}%` } },
                { passport: { ilike: `%${this.search}%` } },
                { firstName: { ilike: `%${this.search}%` } },
                { lastName: { ilike: `%${this.search}%` } }
              ]
            }
          ]
        }
      })
      .then((res: any) => {
        this.elements = res
        this.menu = true
      })
      .finally(() => (this.loading = false))
  }

  @Watch('loadById')
  async findById(n: number, o?: number): Promise<void> {
    if (!n && n === o) return
    this.loading = true
    await service
      .findById(n)
      .then((res: any) => {
        this.input(res)
        this.menu = true
      })
      .catch(() => this.clear())
      .finally(() => (this.loading = false))
  }

  clear(): void {
    this.elements = []
    this.input({})
  }

  @Emit('input')
  input(value: any): any {
    this.menu = false
    this.element = value
    value = this.return ? value['id'] : value
    return value
  }
}
</script>
