<template>
  <v-menu :close-on-content-click="false" v-model="menu" offset-y max-height="275">
    <template v-slot:activator="{ on }">
      <v-text-field
        @keydown="menu = false"
        @keyup.enter="findElements"
        label="Buscar enfermedad ..."
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
    </template>

    <v-list subheader dense v-if="elements.length > 0">
      <v-list-item v-for="item in elements" :key="item.id" @click="selected(item)">
        <v-list-item-content>
          <v-list-item-title v-text="item.name" />
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
import service from '@/services/DiseaseService'

@Component({})
export default class SearchDiseaseComponent extends Vue {
  @Prop() return!: string
  private menu: boolean = false
  private loading: boolean = false
  private search: string = ''
  private element: any = {}
  private elements: any[] = []

  async findElements(): Promise<void> {
    this.loading = true
    await service
      .find({
        limit: 20,
        where: {
          and: [
            { deleted: false },
            {
              or: [
                { code: { ilike: `%${this.search}%` } },
                { name: { ilike: `%${this.search}%` } }
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
        this.selected(res)
        this.menu = true
      })
      .catch(() => this.clear())
      .finally(() => (this.loading = false))
  }

  clear(): void {
    this.elements = []
    this.selected({})
  }

  @Emit('selected')
  selected(value: any): any {
    this.menu = false
    this.element = value
    value = this.return ? value['id'] : value
    return value
  }
}
</script>
