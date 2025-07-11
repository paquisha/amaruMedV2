<template>
  <own-scroll-sheet title="Hospital">
    <template slot="actions">
      <v-btn :disabled="!isValidForm" @click="update()" icon>
        <v-icon>fa-save</v-icon>
      </v-btn>
    </template>
    <v-form @submit.prevent="update" ref="form" v-model="isValidForm" lazy-validation>
      <v-row>
        <v-col cols="12" xs="12" md="4">
          <v-card max-height="225">
            <v-card-text style="display: flex; justify-content: center">
              <own-image-uploader
                :src="hospital.logo || require('@/assets/noimg.svg')"
                @onUpload="updateImage"
                size="200"
                tile
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" xs="12" md="8">
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12" xs="12" md="12">
                  <v-text-field
                    v-model="hospital.name"
                    :rules="rules.required"
                    autocomplete="off"
                    label="Nombre"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" xs="12" md="12">
                  <v-text-field
                    v-model="hospital.smallName"
                    autocomplete="off"
                    label="Nombre corto"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" xs="12" md="6">
                  <v-text-field
                    v-model="hospital.mobile"
                    v-mask="['### ### ####']"
                    :rules="rules.mobile"
                    autocomplete="off"
                    label="Teléfono móvile"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" xs="12" md="6">
                  <v-text-field
                    v-model="hospital.telephone"
                    v-mask="['# ### ###', '### ### ###']"
                    :rules="rules.telephone"
                    autocomplete="off"
                    label="Teléfono fijo"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" xs="12" md="12">
                  <v-text-field
                    v-model="hospital.email"
                    :rules="rules.email"
                    autocomplete="off"
                    label="Correo electrónico"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" xs="12" md="12">
                  <v-text-field
                    v-model="hospital.manager"
                    :rules="rules.required"
                    autocomplete="off"
                    label="Gerente"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" xs="12" md="12">
                  <v-text-field
                    v-model="hospital.ruc"
                    autocomplete="off"
                    label="RUC"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" xs="12" md="12">
                  <v-text-field
                    v-model="hospital.address"
                    :rules="rules.required"
                    autocomplete="off"
                    label="Dirección"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" xs="12" md="12">
                  <v-text-field
                    v-model="hospital.description"
                    autocomplete="off"
                    label="Descripción"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" xs="12" md="6">
                  <own-color-picker
                    v-model="hospital.primaryColor"
                    autocomplete="off"
                    label="Color primario"
                  />
                </v-col>
                <v-col cols="12" xs="12" md="6">
                  <own-color-picker
                    v-model="hospital.secondaryColor"
                    autocomplete="off"
                    label="Color secundario"
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
import Controller from './HospitalController'
export default Controller
</script>
