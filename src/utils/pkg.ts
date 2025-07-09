// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

const pkg = require('../../package.json')

export interface Pkg {
  author: string
  name: string
  description: string
  version: string
  repository: string
  license: string
}

export const app: Pkg = {
  author: pkg.author,
  name: pkg.name,
  description: pkg.description,
  version: pkg.version,
  repository: pkg.repository.url,
  license: `${pkg.repository.url}/blob/master/LICENSE`
}
