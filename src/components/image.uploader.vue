<template>
  <div>
    <v-avatar :size="size" :tile="tile">
      <v-img :src="src" contain>
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>
      </v-img>
    </v-avatar>
    <v-file-input
      style="margin-top: -40px; margin-left: 95%;"
      @change="selected"
      prepend-icon="fa-camera secondary--text"
      accept="image/png, image/jpeg, image/svg+xml"
      hide-input
      :disabled="disabled"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Emit } from 'vue-property-decorator'

@Component({ name: 'v-image-uploader' })
export default class ImageUploader extends Vue {
  @Prop() src!: string
  @Prop({ default: 100 }) size!: number
  @Prop({ default: false }) tile!: boolean
  @Prop({ default: false }) disabled!: boolean

  async selected(file: File): Promise<void> {
    if (file) {
      var formData = new FormData()
      formData.append('file', file)
      // @ts-ignore
      const res = await this.$http.post('/api/storage/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      const data = await res.json()
      this.onUpload(data.url)
    }
  }

  @Emit('onUpload')
  onUpload(value: string): string {
    return value
  }
}
</script>
