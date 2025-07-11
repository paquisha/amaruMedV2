<template>
  <v-app class="login primary">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-12" :loading="loading">
              <v-form
                @submit.prevent="submit"
                ref="form"
                v-model="isValidForm"
                lazy-validation
              >
                <v-card-text>
                  <div class="layout column align-center">
                    <v-avatar size="120">
                      <v-img class="ma-5 primary" src="/logo.svg" />
                    </v-avatar>

                    <h3 class="flex my-4 primary--text">
                      ¿Olvidaste tu contraseña?
                    </h3>
                    <span class="flex my-4 grey--text text--darken-3">
                      Ingrese su dirección de correo electrónico y le enviaremos
                      instrucciones sobre cómo restablecer su contraseña
                    </span>
                  </div>
                  <v-text-field
                    color="primary"
                    append-icon="fa-envelope"
                    label="Correo electrónico"
                    type="email"
                    :rules="rules.email"
                    v-model="email"
                  ></v-text-field>
                  <v-alert
                    transition="scale-transition"
                    v-model="alert"
                    :type="alertType"
                    dismissible
                    text
                  >
                    {{ msg }}
                  </v-alert>
                  <router-link to="/" class="link">Iniciar sesión </router-link>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    :disabled="!isValidForm"
                    :loading="loading"
                    block
                    color="primary white--text"
                    type="submit"
                  >
                    Enviar petición
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
import Controller from './PasswordRestoreController'
export default Controller
</script>

<style lang="sass">
@import "@/views/login/LoginStyle.sass"
</style>
