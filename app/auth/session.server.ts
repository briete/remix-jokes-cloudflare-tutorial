import { createRemoteJWKSet, jwtVerify } from "jose";
import type { Env } from "server";

export type VerifiedUser = {
  sub: string;
  email: string;
};

export async function verify(
  request: Request,
  env: Env
): Promise<VerifiedUser> {
  const jwt = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!jwt) throw new Error("No JWT found in request");

  const JWKS = createRemoteJWKSet(new URL(env.JWKS_URL));
  const { payload } = await jwtVerify(jwt, JWKS, {
    audience: env.POLICY_AUD,
  });

  if (payload.sub === undefined) throw new Error("No sub claim in JWT");

  return {
    sub: payload.sub,
    email: payload.email as string,
  };
}
