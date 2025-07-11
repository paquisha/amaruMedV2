<template>
  <v-form ref="form" v-model="isValidForm" lazy-validation>
    <v-card color="grey lighten-4" class="mb-12 particle">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.senseOrgans"
              :label="`${element.senseOrgans ? 'CP' : 'SP'}: Órganos de los sentidos`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.respiratory"
              :label="`${element.respiratory ? 'CP' : 'SP'}: Respiratorio`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.cardiovascular"
              :label="`${element.cardiovascular ? 'CP' : 'SP'}: Cárdio Vascular`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.digestive"
              :label="`${element.digestive ? 'CP' : 'SP'}: Digestivo`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.genital"
              :label="`${element.genital ? 'CP' : 'SP'}: Genital`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.urinary"
              :label="`${element.urinary ? 'CP' : 'SP'}: Urinario`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.skeletalMuscle"
              :label="`${element.skeletalMuscle ? 'CP' : 'SP'}: Músculo esquelético `"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.endocrine"
              :label="`${element.endocrine ? 'CP' : 'SP'}: Endócrino`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.lymphaticHeme"
              :label="`${element.lymphaticHeme ? 'CP' : 'SP'}: Hemo linfático`"
            />
          </v-col>
          <v-col cols="12" sm="3">
            <v-switch
              v-model="element.nervous"
              :label="`${element.nervous ? 'CP' : 'SP'}: Nervioso`"
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
import service from '@/services/CrosService'
import { createCros, Cros } from '@/models'
import validate from '@/utils/validations'
import alert from '@/utils/alert'

@Component({})
export default class CrosComponent extends Vue {
  @Prop() medRecId!: number
  private element: Cros = createCros()
  private isValidForm = false

  // Validations
  private rules: object = {}

  async create(id: number): Promise<void> {
    //@ts-expect-error
    await this.$refs.form.validate()
    if (this.isValidForm) {
      await service
        .create(this.medRecId, this.element)
        .then((res: Cros) => {
          this.element = res
          alert.onCreateSuccess('Revisión de sistemas y órganos registrado.')
        })
        .catch((err: any) => {
          alert.onCreateError(err, 'revisión de sistemas y órganos')
        })

      this.$emit('click:next')
    }
  }
}
</script>
