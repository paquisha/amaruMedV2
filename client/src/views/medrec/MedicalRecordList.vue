<template>
  <v-data-table
    v-show="show"
    :headers="headers"
    :items="elements"
    :item-class="() => 'selectable'"
    height="calc(100vh - 135px)"
    class="elevation-1 mb-4"
  >
    <template v-slot:item.createdAt="{ item }">
      {{ $formatDateTime(item.createdAt) }}
    </template>

    <template v-slot:item.done="{ item }">
      <v-icon :color="item.done ? 'success' : 'grey'"> fa-check </v-icon>
    </template>

    <template v-slot:item.canceled="{ item }">
      <v-icon :color="item.canceled ? 'warning' : 'grey'"> fa-check </v-icon>
    </template>

    <template v-slot:item.actions="{ item }">
      <div style="width: 100%; min-width: 120px">
        <own-btn @click="showLog(item)" tooltip="Historial" color="grey darken-2" icon>
          <v-icon small> fa-notes-medical</v-icon>
        </own-btn>
        <own-btn @click="showLog(item)" tooltip="Imprimir" color="grey darken-2" icon>
          <v-icon small> fa-print </v-icon>
        </own-btn>

        <own-btn @click="showLog(item)" tooltip="Historial" color="grey darken-2" icon>
          <v-icon small> fa-trash </v-icon>
        </own-btn>
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Emit } from 'vue-property-decorator'
import { MedicalRecord } from '@/models'
import { Patient } from '@/models'

@Component({})
export default class MedicalRecordListComponent extends Vue {
  @Prop() elements!: MedicalRecord[]
  @Prop({ default: true }) show!: boolean

  private headers: object[] = [
    { text: 'Fecha de creación', value: 'createdAt' },
    { text: 'Motivo', value: 'reason' },
    { text: 'Finalizada', value: 'done' },
    { text: 'Cancelada', value: 'canceled' },
    { text: 'Acciones', value: 'actions', align: 'right' }
  ]

  showLog(element: MedicalRecord) {
    //@ts-ignore
    this.$launchLog(element, {
      title: 'Ficha medica',
      msg: element.reason
    })
  }

  @Emit('selected')
  input(value: Patient): Patient {
    return value
  }
}
</script>
