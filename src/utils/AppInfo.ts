// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

export default interface App {
  name: string
  version: string
  company: { name: string; smallName?: string; logo: string }
}
