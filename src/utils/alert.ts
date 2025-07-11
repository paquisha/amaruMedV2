// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import Vue from 'vue'

class VueAlert {
  private render(message: string, caption?: string): string {
    return `
  ${message && caption ? `<b>${message}</b>` : `<span>${message}</span>`}
  <div class="v-toast-caption">${caption ? caption : ''}</div>
  `
  }

  public success(message: string, caption?: string): void {
    // eslint-disable-next-line
    // @ts-ignore
    Vue.$toast.success(this.render(message, caption))
  }

  public error(message: string, caption?: string): void {
    // eslint-disable-next-line
    // @ts-ignore
    Vue.$toast.error(this.render(message, caption), { duration: 6000 })
  }

  public warning(message: string, caption?: string): void {
    // eslint-disable-next-line
    // @ts-ignore
    Vue.$toast.warning(this.render(message, caption))
  }

  public info(message: string, caption?: string): void {
    // eslint-disable-next-line
    // @ts-ignore
    Vue.$toast.info(this.render(message, caption))
  }

  private expiredSession(): void {
    throw new Error('Unauthorized')
  }

  public onCreateSuccess(caption?: string): void {
    this.success('Registro exitoso', caption)
  }
  public onUpdateSuccess(caption?: string): void {
    this.success('Actualización exitosa', caption)
  }
  public onDeleteSuccess(caption?: string): void {
    this.success('Eliminación exitosa', caption)
  }

  // eslint-disable-next-line
  public onCreateError(error: any, model?: string): void {
    switch (error.status) {
      case 401:
        this.expiredSession()
        break
      case 409:
        switch (error.body.error.message) {
          case 'EMAIL_IN_USE':
            this.warning('Confictivo', `El correo electrónico ya está en uso.`)
            break

          default:
            this.warning('Confictivo', `El ${model ?? 'registro'} es duplicado.`)
            break
        }
        break

      case 500:
        this.error('Error interno', 'Error del servidor')
        break

      default:
        this.error('Error', 'El registro no se pudo guardar.')
        break
    }
  }

  public onUpdateError(error: any, model?: string): void {
    switch (error.status) {
      case 401:
        this.expiredSession()
        break
      case 409:
        switch (error.body.error.message) {
          case 'EMAIL_IN_USE':
            this.warning('Confictivo', `El correo electrónico ya está en uso.`)
            break

          default:
            this.warning('Confictivo', `El ${model ?? 'registro'} es duplicado.`)
            break
        }
        break
      case 422:
        this.error(
          'Entidad no procesable',
          'La petición no pudo ser procesada por el servidor:' +
            `${JSON.stringify(error.body.error.details)}`
        )
        break
      case 500:
        this.error('Error interno', 'Error del servidor')
        break

      default:
        this.error('Error', 'El registro no se pudo guardar.')
        break
    }
  }

  // eslint-disable-next-line
  public onDeleteError(error: any, model?: string): void {
    switch (error.status) {
      case 401:
        this.expiredSession()
        break
      case 409:
        this.warning('Confictivo', `El ${model ?? 'registro'} está en uso.`)
        break
      case 500:
        this.error('Error interno', 'Error del servidor')
        break
      default:
        this.error('Error', 'El registro no se pudo eliminar.')
        break
    }
  }
}

export default new VueAlert()
