<template>
  <v-card color="grey lighten-4" class="mb-12 particle">
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="element.temperature"
            background-color="white"
            label="Temperatura"
            autocomplete="off"
            suffix="°C"
            readonly
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="element.systolicPressure"
            label="Presión sistólica"
            background-color="white"
            readonly
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="element.diastolicPressure"
            background-color="white"
            label="Presión Distólica"
            readonly
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="element.pulse"
            background-color="white"
            label="Pulso"
            readonly
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="element.breathingFrequency"
            label="Frecuencia respiratoria"
            background-color="white"
            readonly
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="element.oxygenSaturation"
            label="Saturación de oxígeno"
            background-color="white"
            readonly
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="element.tall"
            background-color="white"
            label="Talla"
            suffix="cm"
            readonly
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="element.weight"
            background-color="white"
            suffix="Kg"
            label="Peso"
            readonly
            outlined
            dense
          />
        </v-col>
        <v-col cols="12" sm="3">
          <v-text-field
            v-model="element.mass"
            label="Masa Coorporal"
            background-color="white"
            suffix="IMC"
            readonly
            outlined
            dense
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-divider />
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="$emit('click:next')" text>
        Siguiente <v-icon right>fa-angle-right</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Prop } from 'vue-property-decorator'
import service from '@/services/VitalSignService'
import { createVitalSign, VitalSign } from '@/models'

@Component({})
export default class VitalSignComponent extends Vue {
  @Prop() medRecId!: number
  private element: VitalSign = createVitalSign()

  async beforeMount(): Promise<void> {
    if (this.medRecId) await this.loadByMedRec(this.medRecId)
  }

  async loadByMedRec(id: number): Promise<void> {
    service.findByMedRecId(id).then(res => {
      this.element = res
    })
  }

  @Watch('medRecId')
  async onMedRecIdChange(v: number): Promise<void> {
    await this.loadByMedRec(v)
  }
}
</script>
