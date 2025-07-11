<template>
  <own-panel
    title="tipos de examenes"
    :empty="$route.name === 'ExamTypes'"
    :subtitle="element.name"
    :fluid="true"
  >
    <template slot="actions">
      <own-btn-confirm
        v-if="elementIndex > -1 && !element.deleted"
        @click:confirm="deleteElement()"
        :small="false"
      />
      <v-btn v-if="elementIndex > -1 && !element.deleted" @click="toEdit()" icon>
        <v-icon>fa-edit</v-icon>
      </v-btn>
      <v-btn @click="createDialog = true" icon>
        <v-icon>fa-plus</v-icon>
      </v-btn>

      <v-btn v-if="elementIndex > -1" @click="showLog()" icon>
        <v-icon>fa-history</v-icon>
      </v-btn>
    </template>

    <template slot="drawer:header">
      <own-search-field @input="findElements" :filter="true" rounded />
    </template>

    <template slot="drawer">
      <v-list-item
        v-for="item in elements"
        :key="item.id"
        @click="onSelectElement(item)"
        dense
      >
        <v-list-item-content>
          <v-list-item-title v-text="item.name"></v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-icon v-if="item.deleted" color="warning lighten-3">fa-minus-circle</v-icon>
        </v-list-item-action>
      </v-list-item>
    </template>
    <template v-slot:content>
      <router-view />

      <v-form ref="form" v-model="isValidForm" lazy-validation>
        <v-dialog
          overlay-color="secondary lighten-4"
          v-model="createDialog"
          width="400"
          persistent
        >
          <v-card>
            <v-toolbar class="primary lighten-1" dark dense>
              <v-toolbar-title class="title"> Registrar tipo de examen </v-toolbar-title>
              <v-spacer />
              <v-btn @click="resetCreator()" icon>
                <v-icon>far fa-times-circle</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text
              ><v-row>
                <v-col cols="12" xs="12">
                  <v-text-field
                    v-model="elementCreator.name"
                    :rules="rules.required"
                    autocomplete="off"
                    label="Nombre"
                    outlined
                    dense
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer />
              <v-btn color="primary lighten-1" @click="createElement()">
                <v-icon left>fa-save</v-icon>Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          overlay-color="secondary lighten-4"
          v-model="editDialog"
          width="400"
          persistent
        >
          <v-card>
            <v-toolbar class="primary lighten-1" dark dense>
              <v-icon class="mr-3" small>fa-sliders-h</v-icon>
              <v-toolbar-title class="title"> Editar tipo de examex</v-toolbar-title>
              <v-spacer />
              <v-btn @click="resetEditor()" icon
                ><v-icon>far fa-times-circle</v-icon></v-btn
              >
            </v-toolbar>

            <v-card-text
              ><v-row>
                <v-col cols="12" xs="12">
                  <v-text-field
                    v-model="elementEditor.name"
                    :rules="rules.required"
                    autocomplete="off"
                    label="Nombre"
                    outlined
                    dense
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer />
              <v-btn color="primary lighten-1" @click="updateElement()">
                <v-icon left>fa-save</v-icon>Guardar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-form>
    </template>
  </own-panel>
</template>

<script lang="ts">
//@ts-ignore
import Controller from './ExamTypesController'
export default Controller
</script>
