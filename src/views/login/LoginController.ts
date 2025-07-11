// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Component from 'vue-class-component'
import { hasValidToken } from '@/utils/auth'
import service from '@/services/AccountService'

@Component({})
export default class LoginController extends Vue {
  public email = ''
  public password = ''
  public alert = false
  public error = ''

  beforeMount(): void {
    if (hasValidToken()) {
      this.$router.push({ name: 'Root' })
    }
  }

  public login(): void {
    service
      .login(this.email, this.password)
      .then(session => {
        //@ts-ignore
        Vue.http.headers.common['Authorization'] = session.token
        sessionStorage.setItem('token', session.token)
        sessionStorage.setItem('expiresAt', String(session.expiresAt))
        this.$router.push({ name: 'Root' })
      })
      .catch(err => {
        this.alert = true
        switch (err.body.error.message) {
          case 'BAD_ACCOUNT':
            this.error = 'No existe la cuenta de usuario.'
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
  }
}
