import { Form } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export function loader({ context }: Route.LoaderArgs) {
  return { message: context.VALUE_FROM_CLOUDFLARE };
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 md:p-24">
      <div className="w-full max-w-md md:max-w-2xl">
        <div className="rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-8 text-3xl font-bold text-center text-gray-800">
            Book Search
          </h1>
          <Form className="space-y-4" action="/search">
            <input
              type="text"
              name="q"
              placeholder="Which book do you want to consult?"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-600 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
            >
              Search
            </button>
          </Form>
        </div>
      </div>
    </main>
  );
}
