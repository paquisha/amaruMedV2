// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Component from 'vue-class-component'
import profileService from '@/services/ProfileService'
import accountService from '@/services/AccountService'
import validate from '@/utils/validations'
import { createProfile } from '@/models'
import { Profile } from '@/models'
import alert from '@/utils/alert'

@Component({})
export default class AccountController extends Vue {
  /********************************************************
   *                      Attributes                       *
   ********************************************************/

  // GUI
  private isValidFormInfo = false
  private isValidFormPass = false

  // Data
  private currentPassword = ''
  private newPassword = ''
  private confirmation = ''
  private profile: Profile = createProfile()

  // Validations
  private rules: object = {
    password: [(v: string) => validate.minLength(v, 8)],
    required: [(v: string) => validate.required(v)],
    email: [(v: string) => validate.required(v), (v: string) => validate.isEmail(v)],
    dni: [(v: string) => validate.isDni(v)],
    passport: [],
    telephone: [(v: string) => validate.isTelephone(v)],
    mobile: [(v: string) => validate.isMobile(v)]
  }

  /********************************************************
   *                     Initializable                    *
   ********************************************************/

  async beforeMount(): Promise<void> {
    this.profile = this.$store.state.session.profile
    this.$store.subscribe(mutation => {
      if (mutation.type === 'setProfile') {
        this.profile = mutation.payload
      }
    })
  }

  /********************************************************
   *                    API Services                      *
   ********************************************************/

  async updateInfo(): Promise<void> {
    //@ts-expect-error
    await this.$refs.formInfo.validate()
    if (this.isValidFormInfo === true) {
      profileService
        .updateById(this.profile.id, {
          dni: this.profile.dni?.replace('-', ''),
          passport: this.profile.passport,
          lastName: this.profile.lastName,
          firstName: this.profile.firstName,
          telephone: this.profile.telephone,
          mobile: this.profile.mobile,
          email: this.profile.email,
          image: this.profile.image,
          address: this.profile.address
        })
        .then(() => {
          alert.onUpdateSuccess(`Información del perfil actualizado.`)
          this.$store.commit('setProfile', this.profile)
        })
        .catch(err => alert.onUpdateError(err, 'perfil'))
    }
  }

  async changePass(): Promise<void> {
    // eslint-disable-next-line
    //@ts-expect-error
    await this.$refs.formPass.validate()
    if (this.isValidFormPass === true) {
      accountService
        .changeMyPassword(this.currentPassword, this.newPassword)
        .then(() => {
          alert.info('Contraseña cambiada')
          //@ts-expect-error
          this.$refs.formPass.reset()
        })
        .catch(err => {
          if (err.body.error.message === 'BAD_CURRENT_PASS') {
            alert.warning('Contraseña no cambiada', 'La contraseña actual es incorrecta')
          } else {
            alert.warning('Contraseña no cambiada', JSON.stringify(err.body.error))
          }
        })
    }
  }
}
