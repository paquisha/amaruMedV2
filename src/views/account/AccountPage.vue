<template>
  <v-card class="overflow-hidden">
    <v-app-bar
      scroll-target="#scrolling-techniques-7"
      color="primary"
      elevate-on-scroll
      absolute
      dense
      dark
    >
      <v-toolbar-title>Cuenta</v-toolbar-title>

      <v-spacer></v-spacer>
    </v-app-bar>
    <v-sheet id="scrolling-techniques-7" class="overflow-y-auto grey lighten-4">
      <v-container style="height: 100vh; padding-top: 50px;">
        <v-row align="center" justify="center">
          <v-col cols="8">
            <v-row>
              <v-col cols="12">
                <v-form
                  @submit.prevent="updateInfo"
                  ref="formInfo"
                  v-model="isValidFormInfo"
                  lazy-validation
                >
                  <v-card>
                    <v-system-bar color="primary  lighten-1" dark>
                      <v-icon>fa-info-circle</v-icon>
                      <span>Editar perfil</span>
                    </v-system-bar>
                    <v-card-text>
                      <v-row>
                        <v-col
                          cols="12"
                          sm="4"
                          style="display: flex; justify-content: center;"
                        >
                          <own-image-uploader
                            :src="profile.image || require('@/assets/user.svg')"
                            :disabled="true"
                          />
                        </v-col>
                        <v-col cols="12" sm="8">
                          <v-text-field
                            v-model="profile.firstName"
                            :rules="rules.required"
                            autocomplete="off"
                            label="Nombres"
                            outlined
                            dense
                          />
                          <v-text-field
                            v-model="profile.lastName"
                            :rules="rules.required"
                            autocomplete="off"
                            label="Apellidos"
                            outlined
                            dense
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="profile.dni"
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
                            v-model="profile.passport"
                            autocomplete="off"
                            label="Pasaporte"
                            outlined
                            dense
                          />
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field
                            v-model="profile.telephone"
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
                            v-model="profile.mobile"
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
                            v-model="profile.email"
                            :rules="rules.email"
                            autocomplete="off"
                            label="Correo electrónico"
                            outlined
                            dense
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-textarea
                            v-model="profile.address"
                            :rules="rules.required"
                            autocomplete="off"
                            label="Dirección"
                            outlined
                            dense
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        :disabled="!isValidFormInfo"
                        color="primary lighten-1"
                        type="submit"
                      >
                        <v-icon left>fa-save</v-icon>Guardar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-col>

              <v-col cols="12">
                <v-form
                  @submit.prevent="changePass"
                  ref="formPass"
                  v-model="isValidFormPass"
                  lazy-validation
                >
                  <v-card>
                    <v-system-bar color="primary  lighten-1" dark>
                      <v-icon>fa-info-circle</v-icon>
                      <span>Cambiar contraseña</span>
                    </v-system-bar>

                    <v-card-text>
                      <v-row>
                        <v-col cols="12" xs="12" sm="4">
                          <own-password-field
                            time="2500"
                            label="Contraseña actual"
                            :rules="rules.password"
                            v-model="currentPassword"
                            outlined
                            dense
                          />
                        </v-col>
                        <v-col cols="12" xs="12" sm="4">
                          <own-password-field
                            time="2500"
                            label="Nueva contraseña"
                            :rules="rules.password"
                            v-model="newPassword"
                            outlined
                            dense
                          />
                        </v-col>
                        <v-col cols="12" xs="12" sm="4">
                          <own-password-field
                            time="2500"
                            label="Confirmar contraseña"
                            :rules="[
                              v =>
                                (v && v === newPassword) || 'La contraseña no coincide.'
                            ]"
                            v-model="confirmation"
                            outlined
                            dense
                          />
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        :disabled="!isValidFormPass"
                        color="primary lighten-1"
                        type="submit"
                      >
                        <v-icon left>fa-save</v-icon>Guardar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-form>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-card>
</template>
<script lang="ts">
//@ts-ignore
import Controller from './AccountController'
export default Controller
</script>
