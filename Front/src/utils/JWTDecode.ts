import {type JwtPayload } from "../types"

export const decodeJWT = (token: string): JwtPayload => {
  const payload = token.split(".")[1]
  return JSON.parse(atob(payload))
}