import type { LoaderArgs} from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import type { Env } from "server";

import { client } from "~/db/client.server";
import { jokes } from "~/db/schema";

export const loader = async ({context}: LoaderArgs) => {
  const env = context.env as Env;
  const jokeItems = await client(env.DB).select().from(jokes).all();
  const randomRowNumber = Math.floor(Math.random() * jokeItems.length);
  const randomJoke = await client(env.DB).select().from(jokes).limit(1).offset(randomRowNumber).get();

  if (!randomJoke) {
    throw new Response("No random joke found", {
      status: 404,
    });
  }

  return json({ randomJoke });
};

export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's a random joke:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id as unknown as string}>
        "{data.randomJoke.name}" Permalink
      </Link>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <div className="error-container">
        <p>There are no jokes to display.</p>
        <Link to="new">Add your own</Link>
      </div>
    );
  }
  
  return (
    <div className="error-container">
      I did a whoopsies.
    </div>
  );
}
