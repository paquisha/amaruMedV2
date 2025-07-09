// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Component from 'vue-class-component'
import alert from '@/utils/alert'
import validate from '@/utils/validations'
import service from '@/services/AccountService'

interface Query {
  username: string
  image?: string
  token: string
}

@Component({})
export default class ActivateController extends Vue {
  /********************************************************
   *                      Attributes                       *
   ********************************************************/
  // data
  private password = ''
  private confirmation = ''
  private query: Query = { username: '', token: '' }

  // GUI
  private view: string = ''
  private isValidForm = false
  public alert = false
  public error = ''

  // Validations
  private rules: object = { password: [(v: string) => validate.minLength(v, 8)] }

  /********************************************************
   *                     Initializable                     *
   ********************************************************/
  beforeMount() {
    if (this.$route.query.query) {
      // eslint-disable-next-line
      // @ts-ignore
      this.query = JSON.parse(this.$route.query.query)
    }
    this.view = (this.$route.name as string).toLowerCase()
  }

  public async activate(): Promise<void> {
    service
      .activate(this.password, this.query.token)
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
          case 'BAD_TOKEN':
            this.error = 'Código de activación no valido.'
            break

          case 'ACTIVED_ACCOUNT':
            this.error = 'La cuenta ya está activada.'
            break

          default:
            this.error = 'No se pudo activar la cuenta.'
            break
        }
      })
  }

  public async restore(): Promise<void> {
    service
      .restore(this.password, this.query.token)
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
          case 'TOKEN_EXPIRED':
            this.error =
              'Token de restauración no válido, vuelva a enviar la solicitud de restauración de contraseña.'
            break

          default:
            this.error =
              'No se pudo restaurar la contraseña, , por favor, póngase en contacto con el administrador.'
            break
        }
      })
  }

  public async submit(): Promise<void> {
    //@ts-expect-error
    await this.$refs.form.validate()
    if (this.isValidForm) {
      if (this.view === 'activate') await this.activate()
      else await this.restore()
    }
  }
}
