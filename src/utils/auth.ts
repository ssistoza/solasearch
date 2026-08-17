import { Result, TaggedError } from 'better-result'
import { ENV } from 'varlock/env'

export class Unauthorized extends TaggedError('Unauthorized')<{
  message: string
}> {}

export function validateDeviceToken(
  token: string | null | undefined,
): Result<void, Unauthorized> {
  if (!token || token !== ENV.DEVICE_TOKEN) {
    return Result.err(
      new Unauthorized({ message: 'Invalid or missing device token' }),
    )
  }
  return Result.ok()
}
