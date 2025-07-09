// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export interface Hospital {
  id: number
  name: string
  smallName?: string
  description?: string
  logo?: string
  telephone?: string
  mobile?: string
  email?: string
  address: string
  manager: string
  ruc?: string
  primaryColor: string
  secondaryColor: string
}

export function createHospital(): Hospital {
  return {
    id: 0,
    name: '',
    email: '',
    address: '',
    manager: '',
    primaryColor: '',
    secondaryColor: ''
  }
}
