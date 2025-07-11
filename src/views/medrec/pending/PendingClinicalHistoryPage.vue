<template>
  <own-panel title="Pendientes" :hideDrawer="!form" :scrollable="form" fluid>
    <template v-slot:actions>
      <template v-if="form">
        <own-btn @click="reset()" tooltip="Cerrar" icon>
          <v-icon>far fa-times-circle</v-icon>
        </own-btn>
      </template>
      <template v-else>
        <own-btn @click="findElements()" tooltip="Refrescar" icon
          ><v-icon>fa-redo-alt</v-icon>
        </own-btn>
      </template>
    </template>

    <template slot="drawer:header">
      <v-tabs v-model="tab">
        <v-tab>PACIENTE</v-tab>
        <v-tab>ANTECEDENTES</v-tab>
      </v-tabs>
    </template>
    <template slot="drawer">
      <v-tabs-items v-model="tab">
        <v-tab-item> <PatientInfo :patientId="element.patientId" /> </v-tab-item>
        <v-tab-item> <Antecedent :patientId="element.patientId" /> </v-tab-item>
      </v-tabs-items>
    </template>

    <template v-slot:content>
      <template v-if="form">
        <v-stepper v-model="step" vertical>
          <v-stepper-step :complete="step > 1" step="1">
            MOTIVO DE CONSULTA
          </v-stepper-step>
          <v-stepper-content step="1">
            <Reason :medRec="element" @click:next="step = 2" />
          </v-stepper-content>

          <v-stepper-step :complete="step > 2" step="2"> SIGNOS VITALES </v-stepper-step>
          <v-stepper-content step="2">
            <VitalSign :medRecId="element.id" @click:next="step = 3" />
          </v-stepper-content>

          <v-stepper-step :complete="step > 3" step="3">
            EXAMEN FÍSICO REGIONAL
          </v-stepper-step>
          <v-stepper-content step="3">
            <Rpe :medRecId="element.id" @click:next="step = 4" />
          </v-stepper-content>

          <v-stepper-step :complete="step > 4" step="4">
            REVISIÓN ACTUAL DE ÓRGANOS Y SISTEMAS
          </v-stepper-step>
          <v-stepper-content step="4">
            <Cros :medRecId="element.id" @click:next="step = 5" />
          </v-stepper-content>

          <v-stepper-step :complete="step > 5" step="5"> EXAMENES </v-stepper-step>
          <v-stepper-content step="5">
            <Exams :medRecId="element.id" @click:next="step = 6" />
          </v-stepper-content>

          <v-stepper-step step="6"> DIAGNÓSTICO </v-stepper-step>
          <v-stepper-content step="6">
            <Diagnostics :medRecId="element.id" @click:finish="finish()" />
          </v-stepper-content>
        </v-stepper>
      </template>
      <template v-else>
        <v-data-table
          :item-class="() => 'selectable'"
          height="calc(100vh - 140px)"
          class="elevation-1 mt-1"
          :headers="headers"
          :items="elements"
        >
          <template v-slot:item.createdAt="{ item }">
            {{ $formatDateTime(item.createdAt) }}
          </template>
          <template v-slot:item.done="{ item }">
            <v-icon :color="item.done ? 'success' : 'grey'">
              {{ `${item.done ? 'fa-check' : 'fa-window-close'}` }}
            </v-icon>
          </template>
          <template v-slot:item.actions="{ item }">
            <div style="width: 100%; min-width: 120px">
              <own-btn
                @click="showLog(item)"
                tooltip="Historial"
                color="grey darken-2"
                icon
              >
                <v-icon small> fa-eye</v-icon>
              </own-btn>

              <own-btn
                @click="toEditElement(item)"
                v-if="$canEdit('medicalrecords')"
                color="grey darken-2"
                tooltip="Revisar"
                icon
              >
                <v-icon small> fa-notes-medical </v-icon>
              </own-btn>

              <own-btn-confirm
                v-if="$canDelete('medicalrecords')"
                @click:confirm="cancel(item)"
                small
              />
            </div>
          </template>
        </v-data-table>
      </template>
    </template>
  </own-panel>
</template>

<script lang="ts">
//@ts-ignore
import Controller from './PendingClinicalHistoryController'
export default Controller
</script>
