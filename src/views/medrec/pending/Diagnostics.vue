<template>
  <v-card color="grey lighten-4" class="particle">
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <own-search-disease @selected="selected" />
        </v-col>
        <v-col cols="12">
          <v-list subheader two-line v-if="elements.length > 0">
            <v-list-item v-for="item in elements" :key="item.id">
              <v-list-item-content>
                <v-list-item-title v-text="`CODE: ${item.code}`" />
                <v-list-item-subtitle v-text="item.name" />
              </v-list-item-content>

              <v-list-item-action>
                <own-btn tooltip="Remover" @click="removeElement(item)" icon>
                  <v-icon color="secondary lighten-2">far fa-times-circle</v-icon>
                </own-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="create()" text> Finalizar </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { createDisease } from '@/models'
import { Disease } from '@/models'
import service from '@/services/DiagnosticService'
import alert from '@/utils/alert'

@Component({})
export default class DiagnosticComponent extends Vue {
  @Prop() medRecId!: number

  private elements: Disease[] = []

  selected(element: Disease): void {
    this.elements.push(element)
  }

  async create(): Promise<void> {
    if (this.elements.length > 0) {
      const reqBody = this.elements.map(element => {
        return {
          diseaseId: element.id
        }
      })
      await service
        .create(this.medRecId, reqBody)
        .then(() => {
          alert.onCreateSuccess('Diagnóstico registrado.')
        })
        .catch((err: any) => {
          alert.onCreateError(err, 'diagnóstico')
        })
    }
    this.$emit('click:finish')
  }

  removeElement(element: Disease): void {
    this.elements.splice(this.elements.indexOf(element), 1)
  }
}
</script>
