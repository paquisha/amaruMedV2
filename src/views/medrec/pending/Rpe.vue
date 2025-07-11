<template>
  <v-form ref="form" v-model="isValidForm" lazy-validation>
    <v-card color="grey lighten-4" class="mb-12 particle">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.head"
              :label="`${element.head ? 'CP' : 'SP'}: Cabeza`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.neck"
              :label="`${element.neck ? 'CP' : 'SP'}: Cuello`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.chest"
              :label="`${element.chest ? 'CP' : 'SP'}: Tórax`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.abdomen"
              :label="`${element.abdomen ? 'CP' : 'SP'}: Abdómen`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.pelvis"
              :label="`${element.pelvis ? 'CP' : 'SP'}: Pelvis`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.extremities"
              :label="`${element.extremities ? 'CP' : 'SP'}: Extremidades`"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="element.observations"
              background-color="white"
              outlined
              label="Observeciones"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="create()" text>
          Siguiente <v-icon right>fa-angle-right</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
import { Prop } from 'vue-property-decorator'
import service from '@/services/RpeService'
import validate from '@/utils/validations'
import alert from '@/utils/alert'
import { createRpe, Rpe } from '@/models'

@Component({})
export default class RpeComponent extends Vue {
  @Prop() medRecId!: number
  private element: Rpe = createRpe()
  private isValidForm = false

  // Validations
  private rules: object = {}

  async beforeMount(): Promise<void> {}

  async create(id: number): Promise<void> {
    //@ts-expect-error
    await this.$refs.form.validate()
    if (this.isValidForm) {
      await service
        .create(this.medRecId, this.element)
        .then((res: Rpe) => {
          this.element = res
          alert.onCreateSuccess('Examen físico regional registrado.')
        })
        .catch((err: any) => {
          alert.onCreateError(err, 'examen físico regional')
        })

      this.$emit('click:next')
    }
  }
}
</script>
