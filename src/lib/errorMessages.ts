export const ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: 'You must be signed in to do that.',
  FORBIDDEN: "You don't have permission to do that.",
  NOT_FOUND: 'The requested item could not be found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  CONFLICT: 'This item already exists.',
  RATE_LIMITED: 'Too many requests. Please wait a moment.',
  SERVER_ERROR: 'Something went wrong on our end. Try again later.',
  NETWORK_ERROR: 'Network error. Check your connection.',
}

export function getFriendlyMessage(code?: string): string {
  if (!code) return 'An unexpected error occurred.'
  return ERROR_MESSAGES[code] ?? `Unexpected error (${code}).`
}
