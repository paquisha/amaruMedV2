// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { RouteConfig } from 'vue-router'
const ActivateRoutes: RouteConfig = {
  path: '/app',
  name: 'App',
  meta: { auth: true },
  component: () => import('@/layouts/app/AppLayout.vue'),
  children: [
    {
      path: '/cuenta',
      name: 'Account',
      component: () => import('@/views/account/AccountPage.vue')
    },
    {
      path: '/usuarios',
      name: 'Users',
      meta: { modules: ['users', 'profiles', 'medics'] },
      component: () => import('@/views/user/UserPage.vue')
    },

    {
      path: '/hospital',
      name: 'Hospital',
      meta: { modules: ['company'] },
      component: () => import('@/views/hospital/HospitalPage.vue')
    },
    {
      path: '/opciones',
      name: 'Options',
      meta: { modules: ['options'] },
      component: () => import('@/views/group/GroupPage.vue')
    },
    {
      path: '/tipospatologias',
      name: 'DiseaseTypes',
      meta: { modules: ['diseases', 'diseasetypes'] },
      component: () => import('@/views/diseases/TypesPage.vue'),
      children: [
        {
          path: '/tipospatologias/:id/patologia',
          name: 'Disease',
          component: () => import('@/views/diseases/DiseasePage.vue')
        }
      ]
    },
    {
      path: '/tipo',
      name: 'ExamTypes',
      meta: { modules: ['exams', 'examtypes'] },
      component: () => import('@/views/exams/ExamTypesPage.vue'),
      children: [
        {
          path: '/tipo/:id/examen',
          name: 'Exam',
          component: () => import('@/views/exams/ExamPage.vue')
        }
      ]
    },
    {
      path: '/pacientes',
      name: 'Patients',
      meta: { modules: ['patients'] },
      component: () => import('@/views/patient/PatientPage.vue')
    },
    {
      path: '/medicos',
      name: 'Medics',
      meta: { modules: ['medics'] },
      component: () => import('@/views/medic/MedicPage.vue')
    },
    {
      path: '/pendientes',
      name: 'PendingClinicalHistory',
      meta: { modules: ['medics'] },
      component: () => import('@/views/medrec/pending/PendingClinicalHistoryPage.vue')
    },
    {
      path: '/paciente/:id/registro',
      name: 'PatientMedRec',
      meta: { modules: ['antecedents', 'diagnostics', 'medicalrecords', 'vitalsigns'] },
      component: () => import('@/views/medrec/MedicalRecordPage.vue')
    },
    {
      path: '/signosvitales',
      name: 'VitalSigns',
      meta: { modules: ['vitalsigns'] },
      component: () => import('@/views/vitalsign/VitalSignPage.vue')
    }
  ]
}
export default ActivateRoutes
