<template>
  <v-app class="primary">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col class="text-center">
            <v-progress-circular :size="125" color="primary" indeterminate>
              <v-avatar size="60">
                <v-img class="ma-5 primary" src="/logo.svg"
              /></v-avatar>
            </v-progress-circular>
            <h1 style="margin-top: 50px;" class="primary--text">
              {{ $store.state.app.info.name }}
            </h1>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
//@ts-ignore
import Controller from './RootController'
export default Controller
</script>
