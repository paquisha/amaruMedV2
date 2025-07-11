<template>
  <own-panel title="Fichas médicas" :scrollable="form">
    <template slot="drawer:header">
      <v-tabs v-model="tab">
        <v-tab>PACIENTE</v-tab>
        <v-tab>ANTECEDENTES</v-tab>
      </v-tabs>
    </template>
    <template slot="drawer">
      <v-tabs-items v-model="tab">
        <v-tab-item> <PatientInfo :patientId="patientId" /> </v-tab-item>
        <v-tab-item> <Antecedent :patientId="element.patientId" /> </v-tab-item>
      </v-tabs-items>
    </template>

    <template slot="actions">
      <template v-if="form">
        <own-btn @click="$refs.preview.report('print')" tooltip="Imprimir pdf" icon>
          <v-icon> fa-print </v-icon>
        </own-btn>

        <own-btn @click="$refs.preview.report('download')" tooltip="Descargar pdf" icon>
          <v-icon> fa-file-download </v-icon>
        </own-btn>

        <own-btn @click="$refs.preview.report()" tooltip="Abrir pdf" icon>
          <v-icon> fa-file-pdf </v-icon>
        </own-btn>

        <own-btn @click="reset()" tooltip="Cerrar" icon>
          <v-icon>far fa-times-circle</v-icon>
        </own-btn>
      </template>
    </template>

    <template slot="content">
      <v-data-table
        v-if="!form"
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
            <own-btn
              @click="showLog(item)"
              tooltip="Historial"
              color="grey darken-2"
              icon
            >
              <v-icon small> fa-notes-medical</v-icon>
            </own-btn>
            <own-btn
              @click="toShowElement(item)"
              tooltip="Vista previa"
              color="grey darken-2"
              icon
            >
              <v-icon small> fa-eye </v-icon>
            </own-btn>

            <own-btn
              @click="showLog(item)"
              tooltip="Historial"
              color="grey darken-2"
              icon
            >
              <v-icon small> fa-trash </v-icon>
            </own-btn>
          </div>
        </template>
      </v-data-table>
      <template v-show="form">
        <Preview ref="preview" :medRecId="element.id" />
      </template>
    </template>
  </own-panel>
</template>

<script lang="ts">
//@ts-ignore
import Controller from './MedicalRecordController'
export default Controller
</script>
