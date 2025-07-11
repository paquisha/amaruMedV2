// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/* eslint-disable */
/**
 * Rules to validate an attribute.
 */
export default {
  /**
   * Rule for a required attribute.
   * @param v value
   * @param msg custom message
   */
  required: (v: string, msg?: string) =>
    (v && String(v).length > 0) || msg || 'Atributo requerido.',
  /**
   * Rule to validate an email.
   * @param v value
   * @param msg custom message
   */
  isEmail: (v: string, msg?: string) =>
    !v || /.+@.+\..+/.test(v) || msg || 'El email no es válido.',

  /**
   * Rule to validate a dni.
   * @param v value
   * @param msg custom message
   */
  isDni: (v: string, msg?: string) =>
    !v || /\d{9}-\d{1}/.test(v) || msg || 'La cédula no es válida.',

  /**
   * Rule to validate a landline number.
   * @param v value
   * @param msg custom message
   */
  isTelephone: (v: string, msg?: string) =>
    !v || /[\d{1} | \d{3} ] \d{3} \d{3}/.test(v) || msg || 'El teléfono no es válido.',

  /**
   * Rule to validate a landline number.
   * @param v value
   * @param msg custom message
   */
  isMobile: (v: string, msg?: string) =>
    !v || /[\d{3} ] \d{3} \d{4}/.test(v) || msg || 'El móvile no es válido.',

  /**
   * Rule to validate the length of a string.
   * @param v value
   * @param length character length
   * @param msg custom message
   */
  equalLength: (v: string, length: number, msg?: string) =>
    !v
      ? true
      : v.length === length || msg || `El atributo debe tener ${length} caracteres.`,

  /**
   * Rule to validate the min length of a string.
   * @param v value
   * @param length min length
   * @param msg custom message
   */
  minLength: (v: string, length: number, msg?: string) =>
    !v ? true : v.length >= length || msg || `Debe tener al menos ${length} caracteres.`,

  /**
   * Rule to validate the max length of a string.
   * @param v value
   * @param length max length
   * @param msg custom message
   */
  maxLength: (v: string, length: number, msg?: string) =>
    !v ? true : v.length <= length || msg || `Debe tener ${length} caracteres maximo.`
}
