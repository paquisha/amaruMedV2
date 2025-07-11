<template>
  <v-card height="350" class="mx-auto">
    <v-toolbar color="primary lighten-1" dark dense>
      <v-toolbar-title>{{ group.name }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn :disabled="optionIndex > 0" @click="create = !create" icon>
        <v-icon small>{{ create ? 'fa-minus' : 'fa-plus' }}</v-icon>
      </v-btn>
    </v-toolbar>

    <div style="overflow-y: auto !important; height: 300px !important">
      <v-form ref="form" v-model="isValidForm" lazy-validation>
        <v-col md="12" v-if="create">
          <v-text-field
            autocomplete="off"
            append-icon="fa-save"
            @click:append="createOption()"
            @keyup.enter="createOption()"
            v-model="option.name"
            :rules="rules.required"
            :label="group.name"
            outlined
            dense
          />
        </v-col>
      </v-form>
      <v-list>
        <v-list-item
          v-for="(item, index) in options"
          @dblclick="toEditOption(item)"
          :key="index"
          style="border-top: 1px solid #dedede"
        >
          <v-list-item-content>
            <v-list-item-title
              v-if="optionIndex !== index"
              v-text="item.name"
            ></v-list-item-title>

            <v-text-field
              v-else
              append-icon="fa-save"
              @click:clear="reset()"
              @click:append="updateOption()"
              @keyup.enter="updateOption()"
              :label="group.name"
              v-model="option.name"
              clearable
              outlined
              dense
            />
          </v-list-item-content>

          <v-list-item-action v-if="optionIndex !== index">
            <v-btn @click="toEditOption(item)" icon>
              <v-icon color="secondary lighten-1" small>fa-edit</v-icon>
            </v-btn> </v-list-item-action
          ><v-list-item-action v-if="optionIndex !== index">
            <own-btn-confirm
              @click:confirm="removeOption(item)"
              color="secondary lighten-1"
              small
            />
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </div>
  </v-card>
</template>
<script lang="ts">
//@ts-ignore
import Controller from './OptionController'
export default Controller
</script>
