// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import service from '@/services/EmailService'
import Component from 'vue-class-component'
import validate from '@/utils/validations'

@Component({})
export default class ActivateController extends Vue {
  /********************************************************
   *                      Attributes                       *
   ********************************************************/
  // data
  private email = ''

  // GUI
  private isValidForm = false
  private loading = false
  public alert = false
  private alertType = 'info'
  public msg = ''

  // Validations
  private rules: object = {
    email: [(v: string) => validate.required(v), (v: string) => validate.isEmail(v)]
  }

  public async submit(): Promise<void> {
    //@ts-expect-error
    await this.$refs.form.validate()
    if (this.isValidForm) {
      this.loading = true
      service
        .restore(this.email)
        .then(() => {
          this.alertType = 'info'
          this.alert = true
          this.msg = 'Revise su correo electrónico para restablecer su contraseña'
          this.loading = false
        })
        .catch(err => {
          this.alertType = 'error'
          this.alert = true
          switch (err.body.error.message) {
            case 'BAD_ACCOUNT':
              this.msg = 'No existe la cuenta de usuario.'
              break
            case 'EMAIL_NOT_VERIFIED':
              this.msg =
                'Esta cuenta no esta activa, por favor, póngase en contacto con el administrador.'
              break

            default:
              this.msg =
                'No se pudo enviar la solicitud para restablecer su contraseña, por favor, póngase en contacto con el administrador.'
              break
          }
          this.loading = false
        })
    }
  }
}
