<template>
  <v-select
    @change="input"
    item-text="name"
    item-value="id"
    :items="roles"
    label="Rol de usuario"
    :value="value"
    :rules="rules"
    outlined
    dense
  />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Emit } from 'vue-property-decorator'
import { Role } from '@/models'

@Component({ name: 'v-roles-field' })
export default class Roles extends Vue {
  @Prop() value!: number
  @Prop() rules!: object[]
  roles: Role[] = []

  async created(): Promise<void> {
    await this.findRoles()
  }

  async findRoles(): Promise<void> {
    // eslint-disable-next-line
    // @ts-ignore
    this.$http.get('/api/roles').then(async res => {
      this.roles = await res.json()
    })
  }

  @Emit('input')
  input(value: string): string {
    return value
  }
}
</script>
