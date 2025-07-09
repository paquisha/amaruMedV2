<template>
  <own-scroll-sheet title="Medicos" :fluid="!form">
    <template slot="actions">
      <template v-if="form">
        <own-btn
          @click="showLog(element)"
          v-if="elementIndex > -1"
          tooltip="Historial"
          icon
        >
          <v-icon> fa-notes-medical</v-icon>
        </own-btn>

        <own-btn
          @click="$router.push({ name: 'PatientMedRec', params: { id: element.id } })"
          v-if="elementIndex > -1 && $access('medicalrecords')"
          tooltip="Ficha médica"
          icon
        >
          <v-icon>fa-notes-medical</v-icon>
        </own-btn>

        <own-btn
          :disabled="!isValidForm || element.deleted"
          @click="submit()"
          tooltip="Guardar"
          icon
        >
          <v-icon>fa-save</v-icon>
        </own-btn>

        <own-btn @click="reset()" tooltip="Cerrar" icon>
          <v-icon>far fa-times-circle</v-icon>
        </own-btn>
      </template>

      <template v-else> </template>
    </template>

    <v-row v-if="form">
      <v-col cols="12" sm="5" md="4">
        <v-card :disabled="elementIndex === -1" color="white" height="200">
          <v-system-bar color="primary lighten-1" dark>
            <v-icon>fa-user-circle</v-icon>Imagen de perfil
            <v-spacer />
          </v-system-bar>
          <v-card-text style="display: flex; justify-content: center">
            <own-image-uploader
              :src="element.image || require('@/assets/user.svg')"
              @onUpload="updateImage"
              :size="150"
            />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="7" md="8">
        <v-card color="white">
          <v-form ref="form" v-model="isValidForm" lazy-validation>
            <v-system-bar color="primary lighten-1" dark>
              <v-icon>fa-id-card</v-icon>
              <span v-if="elementIndex === -1">Registrar nuevo Medico</span>
              <span v-else>Editar información del Medico</span>
            </v-system-bar>

            <v-card-text>
              <v-row>
                <v-col cols="12" md="9"> </v-col>
                <v-col cols="12" md="3">
                  <v-text-field
                    :rules="rules.required"
                    v-model="element.regProfessional"
                    autocomplete="off"
                    label="Registro Profesional"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="element.firstName"
                    :rules="rules.required"
                    autocomplete="off"
                    label="Nombres"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="element.lastName"
                    :rules="rules.required"
                    autocomplete="off"
                    label="Apellidos"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="element.dni"
                    :rules="rules.dni"
                    v-mask="'#########-#'"
                    autocomplete="off"
                    label="Cédula"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="element.passport"
                    autocomplete="off"
                    label="Pasaporte"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="element.telephone"
                    v-mask="['# ### ###', '### ### ###']"
                    :rules="rules.telephone"
                    autocomplete="off"
                    label="Teléfono fijo"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="element.mobile"
                    v-mask="['### ### ####']"
                    :rules="rules.mobile"
                    autocomplete="off"
                    label="Teléfono móvil"
                    outlined
                    dense
                  />
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="element.email"
                    :rules="rules.email"
                    autocomplete="off"
                    label="Correo electrónico"
                    outlined
                    dense
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="element.address"
                    :rules="rules.required"
                    autocomplete="off"
                    label="Dirección"
                    outlined
                    dense
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-form>
        </v-card>
      </v-col>
    </v-row>

    <v-data-table
      :item-class="() => 'selectable'"
      height="calc(100vh - 200px)"
      class="elevation-1 mt-3"
      :headers="headers"
      :items="elements"
      v-else
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <own-search-field @input="findElements" :filter="true" />
          <v-spacer />
        </v-toolbar>
      </template>
      <template v-slot:item.image="{ item }">
        <v-avatar size="35px">
          <img :src="item.image || require('@/assets/user.svg')" :alt="item.firstName" />
        </v-avatar>
      </template>
      <template v-slot:item.firstName="{ item }">
        {{ item.lastName }} {{ item.firstName }}
      </template>
      <template v-slot:item.actions="{ item }">
        <div style="width: 100%; min-width: 120px">
          <own-btn @click="showLog(item)" tooltip="Historial" color="grey darken-2" icon>
            <v-icon small> fa-notes-medical</v-icon>
          </own-btn>

          <own-btn
            @click="$router.push({ name: 'PatientMedRec', params: { id: item.id } })"
            v-if="$access('medicalrecords')"
            color="grey darken-2"
            tooltip="Ficha médica"
            icon
          >
            <v-icon small>fa-notes-medical</v-icon>
          </own-btn>

          <own-btn
            @click="toEditElement(item)"
            v-if="$canEdit('medics')"
            color="grey darken-2"
            tooltip="Editar"
            icon
          >
            <v-icon small> fa-edit </v-icon>
          </own-btn>
          <own-btn-confirm
            v-if="$canDelete('medics')"
            @click:confirm="deleteElement(item)"
            small
          />
        </div>
      </template>
    </v-data-table>
  </own-scroll-sheet>
</template>
<script lang="ts">
//@ts-ignore
import Controller from './MedicController'
export default Controller
</script>
