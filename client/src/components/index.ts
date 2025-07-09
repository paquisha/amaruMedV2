// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'

Vue.component('own-option-selector', () => import('@/components/option.selector.vue'))
Vue.component('own-password-field', () => import('@/components/password.field.vue'))
Vue.component('own-image-uploader', () => import('@/components/image.uploader.vue'))
Vue.component('own-search-field', () => import('@/components/search.field.vue'))
Vue.component('own-scroll-sheet', () => import('@/components/scroll.sheet.vue'))
Vue.component('own-color-picker', () => import('@/components/color.picker.vue'))
Vue.component('own-date-picker', () => import('@/components/date.picker.vue'))
Vue.component('own-btn-confirm', () => import('@/components/btn.confirm.vue'))
Vue.component('own-log-viewer', () => import('@/components/log.viewer.vue'))
Vue.component('own-session-promt', () => import('@/components/session.vue'))
Vue.component('own-panel', () => import('@/components/drawer.panel.vue'))
Vue.component('own-btn', () => import('@/components/btn.tooltip.vue'))
Vue.component('own-roles', () => import('@/components/roles.vue'))
Vue.component('own-empty', () => import('@/components/empty.vue'))

Vue.component('own-search-disease', () => import('@/components/search.disease.vue'))
Vue.component('own-search-patient', () => import('@/components/search.patient.vue'))
Vue.component('own-search-medic', () => import('@/components/search.medic.vue'))
Vue.component('own-search-exam', () => import('@/components/search.exam.vue'))
