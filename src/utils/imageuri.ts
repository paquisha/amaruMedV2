// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import fs from 'fs'
import path from 'path'

const extTypeMap = {
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.bm': 'image/bmp',
  '.bmp': 'image/bmp',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.svg': 'image/svg+xml'
}

type ExtType =
  | '.png'
  | '.gif'
  | '.jpg'
  | '.jpeg'
  | '.bm'
  | '.bmp'
  | '.webp'
  | '.ico'
  | '.svg'

export function imgToURI(file: string) {
  const image = fs.readFileSync(file)
  const ext = path.extname(file) as ExtType
  const contentType = extTypeMap[ext] || 'image/jpeg'
  return `data:${contentType};base64,${image.toString('base64')}`
}
