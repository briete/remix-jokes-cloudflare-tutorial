import type { LoaderArgs } from "@remix-run/cloudflare";

import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { eq } from "drizzle-orm";
import type { Env } from "server";

import { client } from "~/db/client.server";
import { jokes } from "~/db/schema";

export const loader = async ({ params, context }: LoaderArgs) => {
  const env = context.env as Env;
  if (params.jokeId) {
    const joke = await client(env.DB).select().from(jokes).where(eq(jokes.id, params.jokeId as unknown as number)).get();
    if (!joke) {
      throw new Error("Joke not found");
    }
    return json({ joke })
  } else {
    throw new Error("jokeId is required");
  }
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" Permalink</Link>
    </div>
  );
}
