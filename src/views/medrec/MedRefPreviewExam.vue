<template>
  <div>
    <template>
      <v-row no-gutters>
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong>Medico</strong>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="px-3 py-1" outlined tile><strong>NOMBRE</strong> </v-card>
        </v-col>
        <v-col>
          <v-card class="px-3 py-1" outlined tile><strong>APELLIDO</strong> </v-card>
        </v-col>
        <v-col>
          <v-card class="px-3 py-1" outlined tile><strong>SEXO</strong> </v-card>
        </v-col>
        <v-col>
          <v-card class="px-3 py-1" outlined tile
            ><strong>HOJA</strong>
          </v-card>
        </v-col>
        <v-col>
          <v-card class="px-3 py-1" outlined tile
            ><strong>HISTORIA CLINICA</strong>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            {{ medic.lastName.toUpperCase() }} {{ medic.firstName.toUpperCase() }}
          </v-card>
        </v-col>
        <v-col>
          <v-card class="px-3 py-1" outlined tile>{{
            patient.firstName.toUpperCase()
          }}</v-card>
        </v-col>
        <v-col>
          <v-card class="px-3 py-1" outlined tile>{{
            patient.lastName.toUpperCase()
          }}</v-card>
        </v-col>
        <v-col>
          <v-card class="px-3 py-1" outlined tile>{{
            `${patient.sex}`.toUpperCase()
          }}</v-card>
        </v-col>
        <v-col>
          <v-card class="px-3 py-1" outlined tile>{{ medRec.id }}</v-card>
        </v-col>
        <v-col>
          <v-card class="px-3 py-1" outlined tile>{{ patient.hc.toUpperCase() }}</v-card>
        </v-col>
      </v-row>
    </template>
    <!--  REASON FOR CONSULTATION  -->
    <template>
      <v-row no-gutters class="mt-3">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong> 1. MOTIVO DE CONSULTA </strong>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-card class="px-3 py-1" outlined tile> {{ medRec.reason }} </v-card>
        </v-col>
      </v-row>
    </template>
    <!--  PERSONAL BACKGROUND  -->
    <template>
      <v-row no-gutters class="mt-3">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong> 2. ANTECEDENTES PERSONALES</strong>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="antecedent.personal">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong>PERSONAL: </strong> {{ antecedent.personal }}
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="antecedent.surgical">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong>QUIRÚRGICO: </strong> {{ antecedent.surgical }}
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="antecedent.professional">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong>PROFESIONAL: </strong> {{ antecedent.professional }}
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="antecedent.habits">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong>HÁBITOS: </strong> {{ antecedent.habits }}
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="antecedent.clinician">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong>CLÍNICOS: </strong> {{ antecedent.clinician }}
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="antecedent.trauma">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong>TRAUMÁTICOS: </strong> {{ antecedent.trauma }}
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="antecedent.allergy">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong>ALÉRGICOS: </strong> {{ antecedent.allergy }}
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="antecedent.aug">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong>AGO: </strong> {{ antecedent.aug }}
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!--  FAMILY BACKGROUND  -->
    <template>
      <v-row no-gutters class="mt-3">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong> 3. ANTECEDENTES FAMILIARES</strong>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="antecedent.family">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong>FAMILIAR: </strong> {{ antecedent.family }}
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!--  CURRENT ILLNESS  -->
    <template>
      <v-row no-gutters class="mt-3">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong> 4. ENFERMEDAD O PROBLEMA ACTUAL </strong>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters v-if="medRec.currentIllness">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            {{ medRec.currentIllness }}
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!--  CROS  -->
    <template>
      <v-row no-gutters class="mt-3">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong> 5. REVISIÓN ACTUAL DE ÓRGANOS Y SISTEMAS </strong>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'1 ÓRGANOS DE LOS SENTIDOS'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${
                    medRec.cros.senseOrgans ? 'warning--text' : 'success--text'
                  }`"
                  v-text="`${medRec.cros.senseOrgans ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'2 RESPIRATORIO'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${
                    medRec.cros.respiratory ? 'warning--text' : 'success--text'
                  }`"
                  v-text="`${medRec.cros.respiratory ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'3 CÁRDIO VASCULAR'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${
                    medRec.cros.cardiovascular ? 'warning--text' : 'success--text'
                  }`"
                  v-text="`${medRec.cros.cardiovascular ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'4 DIGESTIVO'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${medRec.cros.digestive ? 'warning--text' : 'success--text'}`"
                  v-text="`${medRec.cros.digestive ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'5 GENITAL'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${medRec.cros.genital ? 'warning--text' : 'success--text'}`"
                  v-text="`${medRec.cros.genital ? 'CP' : 'SP'}`"
                />
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'6 URINARIO'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${medRec.cros.urinary ? 'warning--text' : 'success--text'}`"
                  v-text="`${medRec.cros.urinary ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'7 MÚSCULO ESQUELÉTICO'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${
                    medRec.cros.skeletalMuscle ? 'warning--text' : 'success--text'
                  }`"
                  v-text="`${medRec.cros.skeletalMuscle ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'8 ENDÓCRINO'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${medRec.cros.endocrine ? 'warning--text' : 'success--text'}`"
                  v-text="`${medRec.cros.endocrine ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'9 HEMO LINFÁTICO'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${
                    medRec.cros.lymphaticHeme ? 'warning--text' : 'success--text'
                  }`"
                  v-text="`${medRec.cros.lymphaticHeme ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'10 NERVIOSO'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${medRec.cros.nervous ? 'warning--text' : 'success--text'}`"
                  v-text="`${medRec.cros.nervous ? 'CP' : 'SP'}`"
                />
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col
          ><v-card class="px-3 py-1" outlined tile>
            <strong>OBSERVACIONES: </strong> {{ medRec.cros.observations }}
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!--  VITAL SIGNS  -->
    <template>
      <v-row no-gutters class="mt-3">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong> 6. SIGNOS VITALES Y ANTROPOMETRÍA </strong>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col><v-card class="px-3 py-1" outlined tile> TEMPERATURA °C </v-card> </v-col>
        <v-col
          ><v-card class="px-3 py-1" outlined tile> PRESIÓN ARTERIAL </v-card>
        </v-col>
        <v-col><v-card class="px-3 py-1" outlined tile> PULSO / min </v-card> </v-col>
        <v-col
          ><v-card class="px-3 py-1" outlined tile> FRECUENCIA RESPIRATORIA </v-card>
        </v-col>
        <v-col><v-card class="px-3 py-1" outlined tile> PESO / kg </v-card> </v-col>
        <v-col><v-card class="px-3 py-1" outlined tile> TALLA / cm </v-card> </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col
          ><v-card class="px-3 py-1" outlined tile>
            {{ vitalSign.temperature }} °C
          </v-card>
        </v-col>
        <v-col
          ><v-card class="px-3 py-1" outlined tile>
            {{ vitalSign.systolicPressure }}
          </v-card>
        </v-col>
        <v-col
          ><v-card class="px-3 py-1" outlined tile> {{ vitalSign.pulse }} </v-card>
        </v-col>
        <v-col
          ><v-card class="px-3 py-1" outlined tile>
            {{ vitalSign.breathingFrequency }}
          </v-card>
        </v-col>
        <v-col
          ><v-card class="px-3 py-1" outlined tile> {{ vitalSign.weight }} Kg </v-card>
        </v-col>
        <v-col
          ><v-card class="px-3 py-1" outlined tile> {{ vitalSign.tall }} cm </v-card>
        </v-col>
      </v-row>
    </template>

    <!--  RPE-->
    <template>
      <v-row no-gutters class="mt-3">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong> 7. EXAMEN FÍSICO REGIONAL </strong>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'1 CABEZA'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${medRec.rpe.head ? 'warning--text' : 'success--text'}`"
                  v-text="`${medRec.rpe.head ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'2 CUELLO'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${medRec.rpe.neck ? 'warning--text' : 'success--text'}`"
                  v-text="`${medRec.rpe.neck ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'3 TÓRAX'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${medRec.rpe.chest ? 'warning--text' : 'success--text'}`"
                  v-text="`${medRec.rpe.chest ? 'CP' : 'SP'}`"
                />
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'4 ABDÓMEN'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${medRec.rpe.abdomen ? 'warning--text' : 'success--text'}`"
                  v-text="`${medRec.rpe.abdomen ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'5 PELVIS'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${medRec.rpe.pelvis ? 'warning--text' : 'success--text'}`"
                  v-text="`${medRec.rpe.pelvis ? 'CP' : 'SP'}`"
                />
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title v-text="'6 EXTREMIDADES'" />
                </v-list-item-content>
                <v-list-item-action
                  :class="`${medRec.rpe.extremities ? 'warning--text' : 'success--text'}`"
                  v-text="`${medRec.rpe.extremities ? 'CP' : 'SP'}`"
                />
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col
          ><v-card class="px-3 py-1" outlined tile>
            <strong>OBSERVACIONES: </strong> {{ medRec.rpe.observations }}
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!--  DIAGNOSTIC  -->
    <template>
      <v-row no-gutters class="mt-3">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <strong> 8. DIAGNÓSTICO </strong>
          </v-card>
        </v-col>
      </v-row>
      <v-row no-gutters class="mb-5">
        <v-col>
          <v-card class="px-3 py-1" outlined tile>
            <v-list subheader two-line v-if="diseases.length > 0">
              <v-list-item v-for="item in diseases" :key="item.id">
                <v-list-item-content>
                  <v-list-item-title v-text="`CODE: ${item.code}`" />
                  <v-list-item-subtitle v-text="item.name" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { createMedicalRecord, MedicalRecord } from '@/models'
import diagnosticService from '@/services/DiagnosticService'
import antecedentService from '@/services/AntecedentService'
import medRecService from '@/services/MedicalRecordService'
import hospitalService from '@/services/HospitalService'
import { createAntecedent, Antecedent } from '@/models'
import patientService from '@/services/PatientService'
import { createVitalSign, VitalSign } from '@/models'
import { createHospital, Hospital } from '@/models'
import vsService from '@/services/VitalSignService'
import medicService from '@/services/MedicService'
import { createPatient, Patient } from '@/models'
import { Watch } from 'vue-property-decorator'
import { Prop } from 'vue-property-decorator'
import { createMedic, Medic } from '@/models'
import Component from 'vue-class-component'
import { Fields } from '@/utils/query'
import { Disease } from '@/models'
import { Base } from '@/models'
import { PdfOutput } from '@/reports'
import { MedRecReport } from '@/reports'

@Component({})
export default class MedRecPreviewExamComponent extends Vue {
  @Prop() medRecId!: number
  private medRec: MedicalRecord = createMedicalRecord()
  private antecedent: Antecedent = createAntecedent()
  private vitalSign: VitalSign = createVitalSign()
  private hospital: Hospital = createHospital()
  private patient: Patient = createPatient()
  private medic: Medic = createMedic()
  private diseases: Disease[] = []

  private ignoreFields: Fields<Base> = {
    createdAt: false,
    createdBy: false,
    editedBy: false,
    editedAt: false,
    deleted: false,
    deletedAt: false,
    deletedBy: false
  }

  private async beforeMount(): Promise<void> {
    //@ts-ignore
    await this.$store.dispatch('loadOptions')
    await this.init()
  }

  public async init(): Promise<void> {
    if (this.medRecId) {
      await this.findHospital()
      await this.findMedicalRecord()
      await this.findPatient()
      await this.findMedic()
      await this.findVitalSign()
      await this.findDiagnostics()
      await this.findAntecedents()
    }
  }

  public async findHospital(): Promise<void> {
    await hospitalService
      .findDefault({ fields: this.ignoreFields })
      .then((res: Hospital) => {
        this.hospital = res
      })
  }

  public async findMedicalRecord(): Promise<void> {
    await medRecService
      .findById(this.medRecId, {
        include: [
          { relation: 'rpe', scope: { fields: this.ignoreFields } },
          { relation: 'cros', scope: { fields: this.ignoreFields } }
        ],
        fields: {
          createdBy: false,
          editedBy: false,
          editedAt: false,
          deleted: false,
          deletedAt: false,
          deletedBy: false
        }
      })
      .then((res: MedicalRecord) => {
        //@ts-ignore
        res.createdAt = this.$formatDateTime(res.createdAt)
        this.medRec = res
      })
  }

  public async findPatient(): Promise<void> {
    await patientService
      .findById(this.medRec.patientId, { fields: this.ignoreFields })
      .then(async (res: Patient) => {
        //@ts-ignore
        res.sex = await this.$store.dispatch('optionNameById', res.sex)
        this.patient = res
      })
  }

  public async findMedic(): Promise<void> {
    await medicService
      .findById(this.medRec.medicId, { fields: this.ignoreFields })
      .then((res: Medic) => {
        this.medic = res
      })
  }

  public async findAntecedents(): Promise<void> {
    await antecedentService
      .count({ patientId: this.medRec.patientId })
      .then(async (res: number) => {
        if (res === 1) {
          await antecedentService
            .findByPacientId(this.medRec.patientId, { fields: this.ignoreFields })
            .then(async (res: Antecedent) => {
              this.antecedent = res
            })
        }
      })
  }

  public async findVitalSign(): Promise<void> {
    await vsService
      .findByMedRecId(this.medRec.id, {
        fields: {
          createdBy: false,
          editedBy: false,
          editedAt: false,
          deleted: false,
          deletedAt: false,
          deletedBy: false
        }
      })
      .then(async (res: VitalSign) => {
        //@ts-ignore
        res.createdAt = this.$formatDateISO(res.createdAt)
        this.vitalSign = res
      })
  }

  public async findDiagnostics(): Promise<void> {
    await diagnosticService
      .finfByMedRec(this.medRec.id, { fields: this.ignoreFields })
      .then((res: Disease[]) => {
        this.diseases = res
      })
  }

  private report(mode: PdfOutput) {
    MedRecReport(
      mode,
      this.hospital,
      this.medRec,
      this.medic,
      this.patient,
      this.vitalSign,
      this.antecedent,
      this.diseases
    )
  }

  @Watch('medRecId')
  private async onMedRecIdChange(n: number, o: number): Promise<void> {
    if (n !== o) {
      await this.init()
    }
  }
}
</script>
