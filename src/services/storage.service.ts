// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { Request } from '@loopback/rest'
import { Response } from '@loopback/rest'
import multer from 'multer'
import { unlinkSync } from 'fs'
import { resolve as resolvePath } from 'path'
import { SERVER } from '../configs'
import { random } from '../utils'

export interface StorageService {
  /**
   * Multer storage engine
   * @param req HTTP request
   * @param res HTTP response
   */
  getEngine(req: Request, res: Response): multer.StorageEngine
  /**
   * Absolute file path
   * @param filename
   */
  getSandbox(filename: string): string
  /**
   * Delete a stored file.
   * @param name filename
   */
  deleteFile(name: string): void
}

export class MyStorageService implements StorageService {
  constructor() {}

  /**
   * Absolute file path
   * @param filename
   */
  getSandbox(filename: string): string {
    return resolvePath(SERVER.sandbox, filename)
  }

  /**
   * Multer storage engine
   * @param req HTTP request
   * @param res HTTP response
   */
  getEngine(req: Request, res: Response): multer.StorageEngine {
    const options: multer.DiskStorageOptions = {
      // eslint-disable-next-line
      destination: (req, file, cb) => {
        cb(null, SERVER.sandbox)
      },
      // eslint-disable-next-line
      filename: (req, file, cb) => {
        cb(null, this.generateName(file))
      }
    }
    return multer.diskStorage(options)
  }

  /**
   * Delete a stored file.
   * @param name filename
   */
  deleteFile(filename: string): void {
    try {
      unlinkSync(resolvePath(SERVER.sandbox, filename))
    } catch (error) {
      throw new Error('NO_DELETED')
    }
  }

  /**
   * Generate a filename
   * @param file multer file
   */
  private generateName(file: Express.Multer.File): string {
    return random.filename(file.originalname.split('.').pop() ?? '')
  }
}
