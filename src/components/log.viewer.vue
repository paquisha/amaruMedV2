<template>
  <v-dialog
    overlay-color="secondary lighten-4"
    max-width="500px"
    v-model="$log"
    persistent
    scrollable
  >
    <v-card width="600" class="mx-auto">
      <v-toolbar color="primary" dark dense>
        <v-toolbar-title>
          <v-list-item-content>
            <v-list-item-title> HISTORIAL DE ACTIVIDADES </v-list-item-title>
            <v-list-item-subtitle>
              {{ $logConfig.title ? $logConfig.title.toUpperCase() : '' }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-btn @click="close()" icon><v-icon>far fa-times-circle</v-icon></v-btn>
        </v-btn>
      </v-toolbar>
      <v-card-text class="pa-0">
        <v-list two-line subheader v-if="!skeleton">
          <v-subheader inset>
            {{ $logConfig.msg ? $logConfig.msg.toUpperCase() : '' }}
          </v-subheader>
          <v-divider />
          <v-subheader>Creación</v-subheader>

          <v-list-item>
            <v-list-item-avatar color="primary">
              <v-img :src="log.createdBy.image" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ log.createdBy.user }}</v-list-item-title>
              <v-list-item-subtitle>{{ log.createdBy.date }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider v-if="log.editedBy" />
          <v-subheader v-if="log.editedBy">Ultima edición</v-subheader>
          <v-list-item v-if="log.editedBy">
            <v-list-item-avatar color="primary">
              <v-img :src="log.editedBy.image" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ log.editedBy.user }}</v-list-item-title>
              <v-list-item-subtitle>{{ log.editedBy.date }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider v-if="log.deletedBy" />
          <v-subheader v-if="log.deletedBy">Eliminación</v-subheader>
          <v-list-item v-if="log.deletedBy">
            <v-list-item-avatar color="primary">
              <v-img :src="log.deletedBy.image" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ log.deletedBy.user }}</v-list-item-title>
              <v-list-item-subtitle>{{ log.deletedBy.date }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-skeleton-loader v-else type="article" />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Watch } from 'vue-property-decorator'
//@ts-ignore
import { get } from '@/services/Service'
//@ts-ignore
import { Base } from '@/models'

@Component({})
export default class LogViewerComponent extends Vue {
  private log: ResponseLog = {}
  private skeleton: boolean = true

  private async load(log: Partial<Base>): Promise<void> {
    this.skeleton = true
    await get('/api/logs', {
      audit: JSON.stringify({
        createdBy: log.createdBy,
        editedBy: log.editedBy,
        deletedBy: log.deletedBy
      })
    }).then(async (res: any) => {
      const data: ResponseLog = await res.json()
      this.log = {
        createdBy: {
          user: data.createdBy?.user || '',
          image: data.createdBy?.image || require('@/assets/user.svg'),
          //@ts-ignore
          date: this.$formatDateTime(log.createdAt)
        },
        editedBy: data.editedBy
          ? {
              user: data.editedBy.user,
              image: data.editedBy.image || require('@/assets/user.svg'),
              //@ts-ignore
              date: this.$formatDateTime(log.editedAt)
            }
          : undefined,
        deletedBy: data.deletedBy
          ? {
              user: data.deletedBy.user,
              image: data.deletedBy.image || require('@/assets/user.svg'),
              //@ts-ignore
              date: this.$formatDateTime(log.deletedAt)
            }
          : undefined
      }
    })
    this.skeleton = false
  }

  @Watch('$log')
  async onLaunch(val: boolean) {
    if (val === true) {
      this.skeleton = true
      //@ts-ignore
      await this.load(this.$logData)
    }
  }

  public close(): void {
    //@ts-ignore
    this.$closeLog()
  }
}
interface ResponseUser {
  user: string
  image: string
  date: string
}

interface ResponseLog {
  createdBy?: ResponseUser
  editedBy?: ResponseUser
  deletedBy?: ResponseUser
}
</script>
<style lang="sass">
header .v-list-item__subtitle
  font-size: .6em
</style>
