<template>
  <own-scroll-sheet title="Opciones">
    <template slot="actions">
      <v-btn @click="loadGroups()" icon><v-icon>fa-redo-alt</v-icon></v-btn>
    </template>
    <v-row>
      <v-col v-for="item of groups" :key="item.id" xs="12" sm="6" md="4">
        <options :group="item" />
      </v-col>
    </v-row>
  </own-scroll-sheet>
</template>

<script lang="ts">
//@ts-ignore
import Controller from './GroupController'
export default Controller
</script>
