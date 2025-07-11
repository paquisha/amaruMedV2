<template>
  <v-data-table
    :headers="headers"
    :items="elements"
    :search="search"
    sort-by="name"
    :item-class="() => 'selectable'"
    height="calc(100vh - 200px)"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <own-search-field @input="v => findElements(diseaseTypeId, v)" :filter="true" />
        <v-spacer />
        <v-form ref="form" v-model="isValidForm" lazy-validation>
          <v-dialog
            overlay-color="secondary lighten-4"
            max-width="500px"
            v-model="dialog"
            persistent
            scrollable
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="secondary" v-bind="attrs" v-on="on" icon>
                <v-icon>fa-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-toolbar class="primary" dark dense>
                <v-toolbar-title class="title">
                  {{ elementIndex === -1 ? 'Registrar enfermedad' : 'Editar enfermedad' }}
                </v-toolbar-title>
                <v-spacer />
                <v-btn @click="reset()" icon><v-icon>far fa-times-circle</v-icon></v-btn>
              </v-toolbar>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        v-model="element.code"
                        :rules="rules.code"
                        label="Código"
                        autocomplete="off"
                        outlined
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-text-field
                        v-model="element.name"
                        :rules="rules.name"
                        label="Nombre"
                        autocomplete="off"
                        outlined
                        dense
                      />
                    </v-col>

                    <v-col cols="12" sm="12">
                      <v-textarea
                        v-model="element.description"
                        label="Descripción"
                        autocomplete="off"
                        outlined
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="12">
                      <v-textarea
                        v-model="element.actions"
                        label="Acciones"
                        autocomplete="off"
                        outlined
                        dense
                      />
                    </v-col>
                    <v-col cols="12" sm="12"> </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-divider />
              <v-card-actions>
                <v-spacer />
                <v-btn color="primary lighten-1" @click="submit()">
                  <v-icon left>fa-save</v-icon>Guardar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-form>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <div style="width: 100%; min-width: 90px">
        <v-icon small class="mr-4" @click="showLog(item)"> fa-notes-medical</v-icon>
        <v-icon small class="mr-1" @click="toEditElement(item)"> fa-edit </v-icon>
        <own-btn-confirm @click:confirm="deleteElement(item)" small />
      </div>
    </template>
    <template v-slot:no-data> </template>
  </v-data-table>
</template>

<script lang="ts">
//@ts-ignore
import Controller from './DiseaseController'
export default Controller
</script>
