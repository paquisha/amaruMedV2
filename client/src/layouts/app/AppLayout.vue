<template>
  <v-app id="sandbox">
    <own-log-viewer />
    <own-session-promt />
    <v-navigation-drawer mini-variant permanent app>
      <template v-slot:prepend>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <img @click="$router.push({ name: 'App' })" class="primary" src="/logo.svg" />
          </v-list-item-avatar>
        </v-list-item>
      </template>

      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          @click="changeRoute(item)"
          link
          class="pt-1 pb-1"
        >
          <v-tooltip right open-delay="1000" color="secondary">
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-bind="attrs" v-on="on" color="secondary">{{ item.icon }}</v-icon>
            </template>
            <span>{{ item.title }}</span>
          </v-tooltip>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list-item class="px-2">
          <v-list-item-avatar>
            <v-menu
              offset-y
              origin="top bottom"
              :nudge-bottom="10"
              transition="scale-transition"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-img
                  class="secondary"
                  style="cursor: pointer"
                  v-bind="attrs"
                  v-on="on"
                  :src="
                    $store.state.session.profile.image || require('@/assets/user.svg')
                  "
                />
              </template>
              <v-card>
                <v-list class="primary" dark>
                  <v-list-item>
                    <v-list-item-avatar class="primary">
                      <v-img
                        :src="
                          $store.state.session.profile.image ||
                          require('@/assets/user.svg')
                        "
                        alt="avatar"
                      />
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>
                        {{ $store.state.session.profile.firstName }}
                      </v-list-item-title>
                      <v-list-item-subtitle>{{
                        $store.state.session.profile.email
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-list>
                  <v-list-item
                    v-for="item in optionItems"
                    :key="item.title"
                    @click="changeRoute(item)"
                  >
                    <v-list-item-action>
                      <v-icon size="17" color="secondary">{{ item.icon }}</v-icon>
                    </v-list-item-action>
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-menu>
          </v-list-item-avatar>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <v-main>
      <v-container
        class="fill-height grey lighten-4 app-company"
        v-if="$route.name === 'App'"
        fluid
      >
        <v-row align="center" justify="center">
          <div class="layout column row align-center">
            <v-avatar size="150" v-if="company.logo === '/logo.svg'">
              <v-img class="ma-5 primary" src="/logo.svg" />
            </v-avatar>
            <v-img v-else :src="company.logo" max-width="250" />
            <h2 style="margin-top: 50px" class="grey--text text--darken-1">
              {{ company.name }}
            </h2>
          </div>
        </v-row>
      </v-container>
      <router-view class="app-container" tag="v-container" fluid fill-height />
    </v-main>
  </v-app>
</template>
<script lang="ts">
//@ts-ignore
import Controller from './AppLayoutController'
export default Controller
</script>
<style lang="sass">
html
  overflow: hidden
.app-container
  height: 100%
  overflow: hidden

.app-company
  background-image: url(../../assets/particle.svg)
  background-size: 100%
</style>
