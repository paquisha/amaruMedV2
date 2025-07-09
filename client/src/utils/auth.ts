// Copyright Andres Grijalva 2020. All Rights Reserved.
// Node module: amarumed
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

/**
 * Verify if exists a valid access token.
 */
export function hasValidToken(): boolean {
  let isValid: boolean = false
  const token = sessionStorage.getItem('token')
  const expiresAt = sessionStorage.getItem('expiresAt')
  if (expiresAt && token) {
    const now = new Date()
    isValid = now.getTime() < Number(expiresAt) * 1000
  }
  return isValid
}

/**
 * Returns the remaining time of the access token in milliseconds.
 */
export function timeLeft(): number {
  const expiresAt = Number(sessionStorage.getItem('expiresAt'))
  return Math.trunc(expiresAt * 1000 - new Date().getTime())
}
