import type { LoaderArgs, ActionArgs } from "@remix-run/cloudflare";

import { json, redirect } from "@remix-run/cloudflare";
import { Link, useLoaderData, useParams, isRouteErrorResponse, useRouteError } from "@remix-run/react";
import { eq } from "drizzle-orm";
import type { Env } from "server";
import { verify } from "~/auth/session.server";

import { client } from "~/db/client.server";
import { jokes } from "~/db/schema";

export const loader = async ({ request, params, context }: LoaderArgs) => {
  const env = context.env as Env;
  const user = await verify(request, env);

  if (params.jokeId) {
    const joke = await client(env.DB).select().from(jokes).where(eq(jokes.id, params.jokeId as unknown as number)).get();
    if (!joke) {
      throw new Response("What a joke! Not found.", {
        status: 404,
      });
    }
    return json({ 
      isOwner: user.sub === joke.userId,
      joke 
    })
  } else {
    throw new Error("jokeId is required");
  }
};

export const action = async ({
  params,
  request,
  context,
}: ActionArgs) => {
  const form = await request.formData();
  if (form.get("intent") !== "delete") {
    throw new Response(
      `The intent ${form.get("intent")} is not supported`,
      { status: 400 }
    );
  }
  const env = context.env as Env;
  const jokeId = params.jokeId as unknown as number;
  const user = await verify(request, env);
  const joke = await client(env.DB).select().from(jokes).where(eq(jokes.id, jokeId)).get();

  if (!joke) {
    throw new Response("Can't delete what does not exist", {
      status: 404,
    });
  }
  if (joke.userId !== user.sub) {
    throw new Response(
      "Pssh, nice try. That's not your joke",
      { status: 403 }
    );
  }
  await client(env.DB).delete(jokes).where(eq(jokes.id, jokeId)).run();
  return redirect("/jokes");
};

export default function JokeRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>Here's your hilarious joke:</p>
      <p>{data.joke.content}</p>
      <Link to=".">"{data.joke.name}" Permalink</Link>
      {data.isOwner ? (
        <form method="post">
          <button
            className="button"
            name="intent"
            type="submit"
            value="delete"
          >
            Delete
          </button>
        </form>
      ) : null}
    </div>
  );
}

export function ErrorBoundary() {
  const { jokeId } = useParams();
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 400) {
      return (
        <div className="error-container">
          What you're trying to do is not allowed.
        </div>
      );
    }
    if (error.status === 403) {
      return (
        <div className="error-container">
          Sorry, but "{jokeId}" is not your joke.
        </div>
      );
    }
    if (error.status === 404) {
      return (
        <div className="error-container">
          Huh? What the heck is "{jokeId}"?
        </div>
      );
    }
    return (
      <div className="error-container">
        Huh? What the heck is "{jokeId}"?
      </div>
    );
  }

  return (
    <div className="error-container">
      There was an error loading joke by the id "${jokeId}".
      Sorry.
    </div>
  );
}
