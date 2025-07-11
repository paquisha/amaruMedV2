<template>
  <div>
    <v-toolbar dense>
      <v-spacer></v-spacer>

      <own-btn
        v-if="!creation"
        tooltip="Hisporial"
        color="primary"
        @click="showLog()"
        icon
      >
        <v-icon>fa-history</v-icon>
      </own-btn>
      <own-btn
        v-if="$canCreate('antecedents') && this.creation"
        @click="create()"
        tooltip="Guardar"
        color="primary"
        icon
      >
        <v-icon>fa-save</v-icon>
      </own-btn>
      <own-btn
        v-if="$canEdit('antecedents') && !this.creation"
        @click="update()"
        tooltip="Guardar"
        color="primary"
        icon
      >
        <v-icon>fa-save</v-icon>
      </own-btn>
    </v-toolbar>

    <v-row class="px-2">
      <v-col cols="12">
        <v-textarea
          auto-grow
          rows="1"
          row-height="5"
          v-model="antecedent.personal"
          label="Personal"
          autocomplete="off"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          auto-grow
          rows="1"
          row-height="5"
          v-model="antecedent.surgical"
          label="Quirúrgico"
          autocomplete="off"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          auto-grow
          rows="1"
          row-height="5"
          v-model="antecedent.family"
          label="Familiar"
          autocomplete="off"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          auto-grow
          rows="1"
          row-height="5"
          v-model="antecedent.professional"
          label="Profesional"
          autocomplete="off"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          auto-grow
          rows="1"
          row-height="5"
          v-model="antecedent.habits"
          label="Hábitos"
          autocomplete="off"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          auto-grow
          rows="1"
          row-height="5"
          v-model="antecedent.clinician"
          label="Clínicos"
          autocomplete="off"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          auto-grow
          rows="1"
          row-height="5"
          v-model="antecedent.trauma"
          label="Traumáticos"
          autocomplete="off"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          auto-grow
          rows="1"
          row-height="5"
          v-model="antecedent.allergy"
          label="Alérgicos"
          autocomplete="off"
        />
      </v-col>
      <v-col cols="12">
        <v-textarea
          auto-grow
          rows="1"
          row-height="5"
          v-model="antecedent.ago"
          label="AGO"
          autocomplete="off"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Prop } from 'vue-property-decorator'
import service from '@/services/AntecedentService'
//@ts-ignore
import alert from '@/utils/alert'

@Component({})
export default class AntecedentComponent extends Vue {
  @Prop() patientId!: number
  private creation: boolean = false
  private antecedent: any = {}

  async beforeMount(): Promise<void> {
    await this.find()
  }

  private async create(): Promise<void> {
    await service
      .create(this.patientId, this.antecedent)
      .then((res: object) => {
        this.antecedent = res
        this.creation = false
        alert.onCreateSuccess('Antecedente del paciente registrado.')
      })
      .catch((err: object) => alert.onCreateError(err, 'antecedente'))
  }
  private async find(): Promise<void> {
    try {
    } catch (error) {}
    await service
      .findByPacientId(this.patientId)
      .then((res: object) => {
        this.antecedent = res
        this.creation = false
      })
      .catch((err: any) => {
        this.creation = err.status === 404 ? true : false
        this.antecedent = {}
      })
  }
  private async update(): Promise<void> {
    await service
      .updateById(this.antecedent.id, {
        personal: this.antecedent.personal,
        surgical: this.antecedent.surgical,
        family: this.antecedent.family,
        professional: this.antecedent.professional,
        habits: this.antecedent.habits,
        clinician: this.antecedent.clinician,
        trauma: this.antecedent.trauma,
        allergy: this.antecedent.allergy,
        ago: this.antecedent.ago,
        patientId: this.antecedent.patientId
      })
      .then((res: any) => {
        this.antecedent = res
        alert.onCreateSuccess('Antecedente del paciente Actualizado.')
      })
      .catch((err: object) => alert.onUpdateError(err, 'antecedente'))
  }

  showLog() {
    //@ts-ignore
    this.$launchLog(this.antecedent, {
      title: 'Antecedente',
      msg: 'Antecedente'
    })
  }

  @Watch('patientId')
  onPatientIdChange(n: number, o: number) {
    if (n !== o) {
      this.find()
    }
  }
}
</script>
