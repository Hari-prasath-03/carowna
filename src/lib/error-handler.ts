export type Result<S, E extends { reason: string }> = [null, E] | [S, null];

export function ok<S>(data: S): Result<S, never> {
  return [data, null];
}

export function err<E extends { reason: string }>(error: E): Result<never, E> {
  return [null, error];
}
