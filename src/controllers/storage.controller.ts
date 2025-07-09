// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import { inject } from '@loopback/core'
import multer from 'multer'
import { authenticate } from '@loopback/authentication'
import { RestBindings, del } from '@loopback/rest'
import { requestBody } from '@loopback/rest'
import { HttpErrors } from '@loopback/rest'
import { Response } from '@loopback/rest'
import { Request } from '@loopback/rest'
import { param } from '@loopback/rest'
import { post } from '@loopback/rest'
import { oas } from '@loopback/rest'
import { get } from '@loopback/rest'
import * as spec from './specs/storage.specs'
import { StorageService } from '../services'
import { StorageBindings } from '../keys'

@authenticate('jwt')
export class StorageController {
  constructor(@inject(StorageBindings.SERVICE) public storage: StorageService) {}

  @post('/api/storage/image', spec.responseOneUrl())
  async fileUpload(
    @requestBody.file({ description: 'Upload image' }) req: Request,
    @inject(RestBindings.Http.RESPONSE) res: Response
  ): Promise<object> {
    const storage = this.storage.getEngine(req, res)
    const upload = multer({
      fileFilter: function (request, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
          return cb(new Error('ONLY_IMAGES_ARE_ALLOWED'))
        }
        cb(null, true)
      },
      storage
    })
    try {
      return await new Promise<object>((resolve, reject) => {
        // eslint-disable-next-line
      (upload.single('file') as any)(req, res, (err: unknown) => {
        if (err) {
          return reject(err instanceof Error ? err.message : String(err));
        }

        const file = req.file;
        if (!file) {
          return reject(new Error('NO_IMAGE_FILE'));
        }

        resolve({ url: `/image/${file.filename}` });
      });
      })
    } catch (error) {
      throw new HttpErrors.Conflict(error)
    }
  }

  @authenticate.skip()
  @get('/image/{filename}')
  @oas.response.file()
  downloadFile(
    @param.path.string('filename') fileName: string,
    @inject(RestBindings.Http.RESPONSE) response: Response
  ) {
    const file = this.storage.getSandbox(fileName)
    response.sendFile(file)
    return response
  }

  @del('/image/{filename}', spec.responseDeleted())
  async deleteFile(@param.path.string('filename') fileName: string): Promise<object> {
    return new Promise<object>((resolve, reject) => {  // Change generic type to object
      try {
        this.storage.deleteFile(fileName);
        resolve({success: true, message: 'File deleted'});  // Return an object
      } catch (err) {
        reject(err.message || err);
      }
    });
  }
}
