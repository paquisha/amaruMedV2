<template>
  <v-form ref="form" v-model="isValidForm" lazy-validation>
    <v-card color="grey lighten-4" class="particle">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6">
            <v-textarea
              v-model="element.reason"
              background-color="white"
              label="Descripción"
              :rules="rules.reason"
              outlined
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-textarea
              label="Enfermedad o problema actual"
              v-model="element.currentIllness"
              background-color="white"
              outlined
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="update()" text>
          Siguiente <v-icon right>fa-angle-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import service from '@/services/MedicalRecordService'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Prop } from 'vue-property-decorator'
import { createMedicalRecord } from '@/models'
import validate from '@/utils/validations'
import { MedicalRecord } from '@/models'
import alert from '@/utils/alert'

@Component({})
export default class ReasonComponent extends Vue {
  @Prop() medRec!: MedicalRecord

  private isValidForm = false
  private element: MedicalRecord = createMedicalRecord()

  // Validations
  private rules: object = {
    reason: [(v: string) => validate.maxLength(v, 200)]
  }

  beforeMount(): void {
    this.element = this.medRec
  }

  async update(): Promise<void> {
    //@ts-expect-error
    await this.$refs.form.validate()
    if (this.isValidForm) {
      await service
        .updateById(this.medRec.id, {
          reason: this.element.reason,
          currentIllness: this.element.currentIllness
        })
        .then(() => {
          alert.success('Motivo de consulta guardado.')
        })
        .catch((err: any) => {
          alert.onUpdateError(err, 'motivo de consulta')
        })
      this.$emit('click:next')
    }
  }

  @Watch('medRec')
  async onMedRecIdChange(v: MedicalRecord): Promise<void> {
    this.element = v
  }
}
</script>
