<template>
  <v-app class="login primary">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-12">
              <form @submit.prevent="login()">
                <v-card-text>
                  <div class="layout column align-center">
                    <v-avatar size="120">
                      <v-img class="ma-5 primary" src="/logo.svg" />
                    </v-avatar>
                    <h1 class="flex my-4 primary--text">AmaruMed</h1>
                  </div>

                  <v-text-field
                    color="primary"
                    append-icon="fa-envelope"
                    label="Usuario"
                    type="email"
                    required
                    v-model="email"
                  ></v-text-field>
                  <own-password-field v-model="password" time="1500" />
                  <v-alert
                    transition="scale-transition"
                    v-model="alert"
                    type="error"
                    dismissible
                    text
                  >
                    {{ error }}
                  </v-alert>
                  <router-link :to="{ name: 'RestoreAccount' }" class="link">
                    ¿Olvidaste tu contraseña?
                  </router-link>
                </v-card-text>
                <v-card-actions>
                  <v-btn block color="primary white--text" type="submit">entrar</v-btn>
                </v-card-actions>
              </form>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
//@ts-ignore
import Controller from './LoginController'
export default Controller
</script>

<style lang="sass">
@import "./LoginStyle.sass"
</style>
