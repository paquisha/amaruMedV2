<template>
  <v-dialog v-model="dialog" persistent width="500">
    <v-card v-show="dialog">
      <v-system-bar color="primary" class="pa-4 white--text"
        >Sesión expirada<v-spacer></v-spacer>
        <v-icon @click="onClose()" color="white" size="22">far fa-times-circle</v-icon>
      </v-system-bar>
      <v-alert dense text color="primary" icon="fa-info-circle">
        Para extender la sesión de <b>{{ email }}</b> ingrese su contraseña nuevamente.
      </v-alert>
      <v-card-text>
        <own-password-field v-model="password" time="1500" outlined dense />
        <v-alert
          transition="scale-transition"
          v-model="alert"
          type="error"
          dismissible
          text
        >
          {{ error }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary" @click="login()"> extender </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Emit } from 'vue-property-decorator'
//@ts-ignore
import service from '@/services/AccountService'
//@ts-ignore
import { timeLeft } from '@/utils/auth'

@Component({})
export default class Session extends Vue {
  private dialog = false
  public email = ''
  public password = ''
  public alert = false
  public error = ''

  created(): void {
    this.launch()
    //@ts-ignore
    this.email = this.$store.state.session.profile.email
    //@ts-ignore
    this.$store.subscribe(mutation => {
      if (mutation.type === 'setProfile') {
        this.email = mutation.payload.email
      }
    })
  }

  public async login(): Promise<void> {
    if (this.email)
      await service
        //@ts-ignore
        .login(this.email, this.password)
        .then((session: any) => {
          //@ts-ignore
          Vue.http.headers.common['Authorization'] = session.token
          sessionStorage.setItem('token', session.token)
          sessionStorage.setItem('expiresAt', String(session.expiresAt))
          this.dialog = false
          this.launch()
        })
        .catch((err: any) => {
          this.alert = true
          switch (err.body.error.message) {
            case 'BAD_ACCOUNT':
              //@ts-ignore
              this.$router.push({ name: 'Root' })
              break
            case 'BAD_PASS':
              this.error = 'La contraseña es incorrecta.'
              break

            case 'INACTIVE_ACCOUNT':
              this.error = 'La cuenta ya no tiene acceso.'
              break
            case 'EMAIL_NOT_VERIFIED':
              this.error = 'El correo no ha sido verificado.'
              break

            default:
              this.error = 'No se pudo ingresar.'
              break
          }
        })
    else this.onClose()
  }

  launch() {
    setTimeout(() => {
      this.dialog = true
    }, timeLeft())
  }

  onClose() {
    //@ts-ignore
    this.$router.push({ name: 'Root' })
  }
}
</script>

<style></style>
