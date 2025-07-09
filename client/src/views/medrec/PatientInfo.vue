<template>
  <div>
    <v-card>
      <v-img :src="patient.image || require('@/assets/noimg.svg')" height="200px" dark />
    </v-card>

    <v-list two-line subheader>
      <v-subheader class="mt-2 black--text">
        {{ patient.lastName }} {{ patient.firstName }}
      </v-subheader>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="secondary"> fa-portrait </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ patient.hc }}</v-list-item-title>
          <v-list-item-subtitle>Historia clínica</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset />

      <v-list-item v-if="patient.dni">
        <v-list-item-icon>
          <v-icon color="secondary"> fa-id-card </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ patient.dni }}</v-list-item-title>
          <v-list-item-subtitle>Cédula</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="patient.passport">
        <v-list-item-icon>
          <v-icon color="secondary"> fa-passport </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ patient.passport }}</v-list-item-title>
          <v-list-item-subtitle>Pasaporte</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset />

      <v-list-item v-if="patient.mobile">
        <v-list-item-icon>
          <v-icon color="secondary"> fa-mobile </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ patient.mobile }}</v-list-item-title>
          <v-list-item-subtitle>Móvil</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="patient.telephone">
        <v-list-item-icon>
          <v-icon color="secondary"> fa-phone </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ patient.telephone }}</v-list-item-title>
          <v-list-item-subtitle>Casa</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset />

      <v-list-item v-if="patient.sex">
        <v-list-item-icon>
          <v-icon color="secondary"> fa-venus-mars </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title> {{ patient.sex }} </v-list-item-title>
          <v-list-item-subtitle>Sexo</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset v-if="patient.sex" />

      <v-list-item v-if="patient.birthday">
        <v-list-item-icon>
          <v-icon color="secondary"> fa-birthday-cake </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ $formatDate(patient.birthday) }}</v-list-item-title>
          <v-list-item-subtitle>Fecha de nacimiento</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-list-item v-if="patient.birthday">
        <v-list-item-icon />

        <v-list-item-content>
          <v-list-item-title>{{ $calcAge(patient.birthday) }} años</v-list-item-title>
          <v-list-item-subtitle>Edad</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset v-if="patient.birthday" />

      <v-list-item v-if="patient.email">
        <v-list-item-icon>
          <v-icon color="secondary"> fa-envelope </v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ patient.email }}</v-list-item-title>
          <v-list-item-subtitle>Correo electrónico</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Prop } from 'vue-property-decorator'
import { createPatient } from '@/models'
import { Patient } from '@/models'
import service from '@/services/PatientService'

@Component({})
export default class PatientInfoComponent extends Vue {
  @Prop() patientId!: number
  private patient: Patient = createPatient()

  async beforeMount(): Promise<void> {
    await this.$store.dispatch('loadOptions')
    await this.findPatient()
  }

  async findPatient(): Promise<void> {
    await service
      .findById(this.patientId)
      .then(async (res: Patient) => {
        res.sex = await this.$store.dispatch('optionNameById', res.sex)
        this.patient = res
      })
      .catch((err: any) => {
        if (err.status === 404) this.$emit('onError')
      })
  }
  @Watch('patientId')
  onPatientIdChange(n: number, o: number) {
    if (n !== o) {
      this.findPatient()
    }
  }
}
</script>
