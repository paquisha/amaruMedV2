// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'
import Component from 'vue-class-component'
import { hasValidToken } from '@/utils/auth'

@Component({ name: 'app-yalout' })
export default class AppLayoutController extends Vue {
  mini: boolean = false
  company: object = {}
  public items: Item[] = []

  public optionItems: Item[] = [
    { icon: 'fa-user-cog', title: 'Configuraciones', routerName: 'Account' },
    { icon: 'fa-sign-out-alt', title: 'Salir', routerName: 'Logout' }
  ]

  async beforeMount(): Promise<void> {
    if (hasValidToken()) {
      this.init()
    } else {
      this.$router.push({ name: 'Root' })
    }

    this.company = this.$store.state.app.info.company
  }

  private init() {
    //@ts-ignore
    const modules: string[] = this.$modules()
    if (modules.includes('company'))
      this.items.push({
        title: 'Hospital',
        icon: 'fa-hospital-alt',
        routerName: 'Hospital'
      })
    if (modules.includes('users'))
      this.items.push({
        title: 'Usuarios',
        icon: 'fa-users',
        routerName: 'Users'
      })

    if (modules.includes('medicalrecords') && this.$store.state.session.isMedic)
      this.items.push({
        title: 'Revisiones',
        icon: 'fa-laptop-medical',
        routerName: 'PendingClinicalHistory'
      })
    if (modules.includes('patients'))
      this.items.push({
        title: 'Pacientes',
        icon: 'fa-user-injured',
        routerName: 'Patients'
      })
    if (modules.includes('medics'))
      this.items.push({
        title: 'Medicos',
        icon: 'fa-user-md',
        routerName: 'Medics'
      })
    if (modules.includes('options'))
      this.items.push({
        title: 'Opciones',
        icon: 'fa-clipboard-list',
        routerName: 'Options'
      })
    if (modules.includes('diseases'))
      this.items.push({
        title: 'Enfermedades',
        icon: 'fa-notes-medical',
        routerName: 'DiseaseTypes'
      })
    if (modules.includes('exams'))
      this.items.push({
        title: 'Examenes',
        icon: 'fa-file-signature',
        routerName: 'ExamTypes'
      })

    if (modules.includes('vitalsigns'))
      this.items.push({
        title: 'Signos vitales',
        icon: 'fa-heartbeat',
        routerName: 'VitalSigns'
      })
  }

  public changeRoute(item: Item) {
    if (item.routerName !== this.$route.name)
      if (item.routerName === 'Logout') {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('expiresAt')
        // @ts-ignore
        Vue.http.headers.common['Authorization'] = undefined
        this.$store.commit('setProfile', { user: null, profile: null })
        this.$store.commit('setModules', [])
        this.$router.push({ name: 'Root' })
      } else {
        this.$router.push({ name: item.routerName })
      }
  }
}

interface Route {
  icon?: string
  title: string
  routerName?: string
}

interface Item {
  icon: string
  title: string
  routerName?: string
  children?: Route[]
}
