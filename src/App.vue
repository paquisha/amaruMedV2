<template>
  <div>
    <!-- for example router view -->
    <router-view />
    <!-- set progressbar -->
    <vue-progress-bar />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
//@ts-ignore
import MyApp from '@/utils/AppInfo'

@Component({ name: 'app' })
export default class App extends Vue {
  async beforeMount(): Promise<void> {
    const primary: string | null = sessionStorage.getItem('primary')
    const secondary: string | null = sessionStorage.getItem('secondary')
    const app: string | null = sessionStorage.getItem('app')
    if (!primary && !secondary && !app)
      await fetch('/api/app')
        .then(res => res.json())
        .then(data => {
          const app: MyApp = {
            name: data.name,
            version: data.version,
            company: {
              name: data.company.name,
              smallName: data.company.smallName,
              logo: data.company.logo
            }
          }
          // @ts-ignore
          this.$vuetify.theme.themes.light.primary = data.company.primaryColor
          // @ts-ignore
          this.$vuetify.theme.themes.light.secondary = data.company.secondaryColor

          sessionStorage.setItem('primary', data.company.primaryColor)
          sessionStorage.setItem('secondary', data.company.secondaryColor)
          sessionStorage.setItem('app', JSON.stringify(app))

          //@ts-ignore
          this.$store.commit('setApp', app)
        })
    else {
      //@ts-ignore
      this.$store.commit('setApp', JSON.parse(app))
    }
    //@ts-ignore
    document.title = this.$store.state.app.info.name
  }
}
</script>

<style lang="sass">
::-webkit-scrollbar
  width: 5px
::-webkit-scrollbar-track
  background: transparent
::-webkit-scrollbar-thumb
  background: rgb(230,230,230)
  &:vertical
    &:active
      background: rgb(150,150,150)

// Disable selection
body
  -webkit-touch-callout: none  // iOS Safari
  -webkit-user-select: none    // Chrome 6.0+, Safari 3.1+, Edge & Opera 15+
  -moz-user-select: none       // Firefox
  -ms-user-select: none        // IE 10+ and Edge
  user-select: none            // Non-prefixed version
  & .particle
    background-image: url(./assets/particle.svg)!important
    background-size: 100%!important

// Enable selecction
.selectable
  -webkit-touch-callout: text  // iOS Safari
  -webkit-user-select: text    // Chrome 6.0+, Safari 3.1+, Edge & Opera 15+
  -moz-user-select: text       // Firefox
  -ms-user-select: text        // IE 10+ and Edge
  user-select: text            // Non-prefixed version
</style>
