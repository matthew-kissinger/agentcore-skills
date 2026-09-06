// Offline contract model, NOT JWT validation or an AWS request interceptor.
export const FORWARDED = 'x-example-caller-bearer';
export function outboundHeaders(callerBearer, allowedHeaders) {
  if (!/^Bearer \S+$/i.test(callerBearer)) throw new Error('Expected bearer syntax');
  const emitted = { [FORWARDED]: callerBearer };
  const allowed = new Set(allowedHeaders.map(h => h.toLowerCase()));
  const forwarded = Object.fromEntries(Object.entries(emitted).filter(([h]) => allowed.has(h)));
  return { ...forwarded, authorization: 'AWS4-HMAC-SHA256 synthetic-test-signature' };
}
export function selectBearer(input) {
  const headers = new Headers(input);
  const primary = headers.get('authorization');
  const forwarded = headers.get(FORWARDED);
  if (primary && /^Bearer /i.test(primary)) {
    if (!/^Bearer \S+$/i.test(primary) || forwarded) throw new Error('Ambiguous or malformed credentials');
    return primary;
  }
  if (primary && !primary.startsWith('AWS4-HMAC-SHA256 ')) throw new Error('Unsupported authorization');
  if (!forwarded || !/^Bearer \S+$/i.test(forwarded)) throw new Error('Missing caller bearer');
  // Caller MUST cryptographically validate this value and authorize its scopes.
  return forwarded;
}
