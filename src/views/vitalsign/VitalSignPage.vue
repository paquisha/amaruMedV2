<template>
  <own-scroll-sheet title="Signos Vitales">
    <template v-slot:actions>
      <own-btn @click="reset()" tooltip="Limpiar" icon>
        <v-icon>fa-eraser</v-icon>
      </own-btn>

      <own-btn
        :disabled="!isValidForm || element.deleted"
        @click="submit()"
        tooltip="Guardar"
        icon
      >
        <v-icon>fa-save</v-icon>
      </own-btn>
    </template>
    <v-form ref="form" v-model="isValidForm" lazy-validation>
      <v-row>
        <v-col cols="12" sm="6">
          <v-card color="white" height="200">
            <v-system-bar color="primary lighten-1" dark>
              <v-icon>fa-user-injured</v-icon>Paciente
              <v-spacer />
            </v-system-bar>
            <v-card-text>
              <own-search-patient
                ref="patient"
                v-model="medRec.patientId"
                :loadById="Number($route.query.patientId)"
                return="id"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card color="white" height="200">
            <v-system-bar color="primary lighten-1" dark>
              <v-icon>fa-user-md</v-icon>Medico
              <v-spacer />
            </v-system-bar>
            <v-card-text>
              <own-search-medic
                :loadById="Number($route.query.medicId)"
                v-model="medRec.medicId"
                ref="medic"
                return="id"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" sm="12">
          <v-card color="white">
            <v-system-bar color="primary lighten-1" dark>
              <v-icon>fa-heartbeat</v-icon>Signos vitales
              <v-spacer />
            </v-system-bar>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="element.temperature"
                    label="Temperatura"
                    autocomplete="off"
                    :rules="rules.required"
                    suffix="°C"
                    type="number"
                    min="0"
                    max="45"
                    step=".01"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="element.systolicPressure"
                    label="Presión sistólica"
                    :rules="rules.required"
                    autocomplete="off"
                    type="number"
                    min="0"
                    max="200"
                    step=".01"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="element.diastolicPressure"
                    label="Presión Distólica"
                    :rules="rules.required"
                    autocomplete="off"
                    type="number"
                    min="0"
                    max="200"
                    step=".01"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="element.pulse"
                    label="Pulso"
                    :rules="rules.required"
                    autocomplete="off"
                    type="number"
                    min="0"
                    max="150"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="element.breathingFrequency"
                    label="Frecuencia respiratoria"
                    :rules="rules.required"
                    autocomplete="off"
                    type="number"
                    min="0"
                    max="100"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="element.oxygenSaturation"
                    label="Saturación de oxígeno"
                    :rules="rules.required"
                    autocomplete="off"
                    type="number"
                    min="0"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="element.tall"
                    :rules="rules.required"
                    autocomplete="off"
                    label="Talla"
                    type="number"
                    suffix="cm"
                    min="0"
                    max="200"
                    step=".01"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="element.weight"
                    :rules="rules.required"
                    autocomplete="off"
                    type="number"
                    suffix="Kg"
                    label="Peso"
                    min="0"
                    max="300"
                    step=".01"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field
                    v-model="element.mass"
                    label="Masa Coorporal"
                    :rules="rules.required"
                    autocomplete="off"
                    type="number"
                    suffix="IMC"
                    min="0"
                    max="200"
                    step=".01"
                    outlined
                    dense
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </own-scroll-sheet>
</template>

<script lang="ts">
//@ts-ignore
import Controller from './VitalSignController'
export default Controller
</script>
