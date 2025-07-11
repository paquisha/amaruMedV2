<template>
  <div class="drawer-panel">
    <v-card class="overflow-hidden body" height="100vh">
      <v-app-bar color="primary" absolute dense dark>
        <v-toolbar-title>
          <v-list-item-content>
            <v-list-item-title>
              {{ title ? title.toUpperCase() : '' }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ subtitle ? subtitle.toUpperCase() : '' }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-toolbar-title>

        <v-spacer></v-spacer>
        <slot name="actions" />
        <v-app-bar-nav-icon v-if="!hideDrawer" @click="drawer = !drawer" />
      </v-app-bar>
      <v-sheet
        :class="scrollable ? 'overflow-y-auto' : ''"
        class="grey lighten-4 particle"
      >
        <v-container :fluid="fluid">
          <own-empty v-if="empty" width="400" />
          <slot else name="content" />
        </v-container>
      </v-sheet>
    </v-card>
    <v-card class="overflow-hidden sidebar" v-if="!hideDrawer && drawer">
      <v-app-bar
        scroll-target="#scrolling-techniques-7"
        color="grey lighten-4"
        v-if="hasDrawerHeader"
        elevate-on-scroll
        absolute
      >
        <slot name="drawer:header" />
      </v-app-bar>
      <v-sheet id="scrolling-techniques-7" class="overflow-y-auto">
        <v-container
          :style="hasDrawerHeader ? 'padding: 60px 0px' : ''"
          style="height: 100vh"
        >
          <div class="drawer-content">
            <slot name="drawer" />
          </div>
        </v-container>
      </v-sheet>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Watch } from 'vue-property-decorator'

@Component({})
export default class DawerPanel extends Vue {
  @Prop() title!: string
  @Prop() subtitle!: string
  @Prop({ default: false }) fluid!: boolean
  @Prop({ default: false }) empty!: boolean
  @Prop({ default: false }) hideDrawer!: boolean
  @Prop({ default: false }) scrollable!: boolean
  private drawer: boolean = true

  beforeMount():void{
    this.drawer = !this.hideDrawer
  }

  private mounted(): void {
    window.addEventListener('resize', () => {
      if (window.innerWidth < 800) {
        this.drawer = false
      } else {
        this.drawer = true
      }
    })
  }

@Watch('hideDrawer')
onHideDrawerChange(v:boolean){
  this.drawer=!v
}

  public get hasDrawerHeader(): boolean {
    return this.$slots['drawer:header'] ? true : false
  }
}
</script>

<style lang="sass">
.drawer-panel
    width: 100%
    height: 100%
    display: flex
    justify-content: flex-end

    header .v-list-item__subtitle
      font-size: .6em

    .body
        width: 100%
        & .v-sheet
            height: 100%
            & .container
                margin-top: 50px
                height: 100%

    .sidebar
        width: 400px
        & .search
            padding: 0px 10px
        & .drawer-content
            height: calc( 100% - 50px )
            & .container
                margin-top: 50px
                overflow-y: auto
</style>
