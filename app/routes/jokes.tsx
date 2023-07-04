import type { LinksFunction, LoaderArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import stylesUrl from "~/styles/jokes.css";
import { client } from "~/db/client.server";
import { jokes } from "~/db/schema";
import type { Env } from "server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesUrl },
];

export const loader = async ({ context }: LoaderArgs) => {
  const env = context.env as Env;
  return json({
    jokeListItems: await client(env.DB).select().from(jokes).all(),
  });
}

export default function JokesRoute() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="jokes-layout">
      <header className="jokes-header">
        <div className="container">
          <h1 className="home-link">
            <Link
              to="/"
              title="Remix Jokes"
              aria-label="Remix Jokes"
            >
              <span className="logo">🤪</span>
              <span className="logo-medium">J🤪KES</span>
            </Link>
          </h1>
        </div>
      </header>
      <main className="jokes-main">
        <div className="container">
          <div className="jokes-list">
            <Link to=".">Get a random joke</Link>
            <p>Here are a few more jokes to check out:</p>
            <ul>
              {data.jokeListItems.map(({ id, name }) => (
                <li key={id}>
                  <Link to={id.toString()}>{name}</Link>
                </li>
              ))}
            </ul>
            <Link to="new" className="button">
              Add your own
            </Link>
          </div>
          <div className="jokes-outlet">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
