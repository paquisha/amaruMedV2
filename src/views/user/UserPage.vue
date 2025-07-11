<template>
  <own-scroll-sheet title="Usuarios" :fluid="!form">
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
          v-if="elementIndex !== -1 && !element.user.emailVerified"
          @click="sendWelcomeEmail()"
          tooltip="Enviar email de activación"
          icon
        >
          <v-icon>fa-envelope</v-icon>
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

      <template v-else>
        <own-btn v-if="$canCreate('users')" @click="form = true" tooltip="Nuevo" icon>
          <v-icon>fa-plus</v-icon>
        </own-btn>
      </template>
    </template>

    <v-form ref="form" v-if="form" v-model="isValidForm" lazy-validation>
      <v-row>
        <v-col cols="12" sm="5" md="4">
          <v-card color="white" height="200">
            <v-system-bar color="primary lighten-1" dark>
              <v-icon>fa-user-circle</v-icon>Cuenta
              <v-spacer />
            </v-system-bar>
            <v-card-text>
              <own-roles v-model="element.user.roleId" :rules="rules.required" />
              <v-switch
                v-model="element.user.isActive"
                class="ma-0"
                :label="element.user.isActive ? 'Cuenta activa' : 'Cuenta inactiva'"
              />

              <v-switch
                :disabled="isMedic"
                v-if="$canCreate('medics')"
                v-model="registerAsMedic"
                class="ma-0"
                label="Registrar como médico"
              />
            </v-card-text>
          </v-card>

          <v-card
            :disabled="
              elementIndex === -1 || element.deleted || !element.user.emailVerified
            "
            color="white"
            height="175"
            class="mt-5"
          >
            <v-system-bar color="primary lighten-1" dark>
              <v-icon>fa-key</v-icon>Cambiar contraseña
              <v-spacer />
            </v-system-bar>
            <v-card-text>
              <own-password-field v-model="password" :error="passError" outlined dense />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="changePassword()" color="primary lighten-1" text>
                <v-icon left>fa-save</v-icon>Cambiar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" sm="7" md="8">
          <v-card color="white">
            <v-system-bar color="primary lighten-1" dark>
              <v-icon>fa-id-card</v-icon>
              <span v-if="elementIndex === -1">Crear nuevo perfil</span>
              <span v-else>Editar información personal</span>
            </v-system-bar>

            <v-card-text>
              <v-row>
                <v-col cols="12" sm="4" style="display: flex; justify-content: center">
                  <own-image-uploader
                    :src="element.image || require('@/assets/user.svg')"
                    @onUpload="updateImage"
                    :disabled="elementIndex === -1"
                  />
                </v-col>
                <v-col cols="12" sm="8">
                  <v-text-field
                    v-model="element.firstName"
                    :rules="rules.required"
                    autocomplete="off"
                    label="Nombres"
                    outlined
                    dense
                  />
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
                  <v-textarea
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
          </v-card>
        </v-col>
      </v-row>
    </v-form>

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
          <own-search-field @input="findProfiles" :filter="true" />
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

      <template v-slot:item.user.isActive="{ item }">
          {{
            !item.user.emailVerified
              ? 'Sin activar'
              : item.user.isActive
              ? 'Activo'
              : 'Inactivo'
          }}
        <!-- <v-chip
          class="mx-2"
          :color="
            !item.user.emailVerified
              ? 'warning'
              : item.user.isActive
              ? 'success'
              : 'error'
          "
        >
          {{
            !item.user.emailVerified
              ? 'Sin activar'
              : item.user.isActive
              ? 'Activo'
              : 'Inactivo'
          }}
        </v-chip> -->
      </template>

      <template v-slot:item.actions="{ item }">
        <div style="width: 100%; min-width: 120px">
          <own-btn @click="showLog(item)" tooltip="Historial" color="grey darken-2" icon>
            <v-icon small> fa-notes-medical </v-icon>
          </own-btn>

          <own-btn
            @click="toEditElement(item)"
            v-if="$canEdit('users')"
            color="grey darken-2"
            tooltip="Editar"
            icon
          >
            <v-icon small> fa-edit </v-icon>
          </own-btn>
          <own-btn-confirm
            v-if="$canDelete('users')"
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
import Controller from './UserController'
export default Controller
</script>
