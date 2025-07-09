<template>
  <v-app class="login primary">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-12">
              <v-form
                @submit.prevent="submit"
                ref="form"
                v-model="isValidForm"
                lazy-validation
              >
                <v-card-text>
                  <div class="layout column align-center">
                    <v-avatar v-if="query.image" size="120px">
                      <v-img :src="query.image" :alt="query.username" />
                    </v-avatar>
                    <v-avatar v-else class="primary" size="120px">
                      <v-img
                        src="@/assets/user.svg"
                        alt="Usuario"
                        width="120"
                        height="120"
                      />
                    </v-avatar>
                    <h1 class="flex my-4 primary--text">
                      {{ view === 'activate' ? 'Bienvenido' : 'Restablecer' }}
                    </h1>
                    <h3 class="flex my-4 primary--text">
                      {{ query.username }}
                    </h3>
                  </div>
                  <own-password-field
                    v-model="password"
                    :rules="rules.password"
                    time="1500"
                  />
                  <own-password-field
                    v-model="confirmation"
                    :rules="[v => (v && v === password) || 'La contraseña no coincide.']"
                    time="1500"
                    label="Confirmar"
                  />
                  <v-alert
                    transition="scale-transition"
                    v-model="alert"
                    type="error"
                    dismissible
                    text
                  >
                    {{ error }}
                  </v-alert>
                  <router-link to="/" class="link">Iniciar sesión </router-link>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    :disabled="!isValidForm"
                    block
                    color="primary white--text"
                    type="submit"
                  >
                    {{ view === 'activate' ? 'Activar' : 'Cambiar' }}
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
//@ts-ignore
import Controller from './PasswordSetterController'
export default Controller
</script>

<style lang="sass">
@import "@/views/login/LoginStyle.sass"
</style>
