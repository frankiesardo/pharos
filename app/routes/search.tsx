import { Form, redirect, useLoaderData } from "react-router";
import type { Route } from "./+types/search";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q") || "";

  const response = await fetch(
    `https://z-lib.gs/s/${encodeURIComponent(
      query
    )}?extensions%5B0%5D=PDF&extensions%5B1%5D=EPUB`
  );

  const body = await response.text();
  const books = parseBooks(body);
  return books;
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const fileName = formData.get("id") + "." + formData.get("extension");
  return redirect(`/chat/${fileName}`);
}

export default function Search() {
  const books = useLoaderData<typeof loader>();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="w-full max-w-md md:max-w-4xl">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Search Results</h2>
          <div className="space-y-4">
            {books.length === 0 ? (
              <div className="rounded-lg border bg-card p-8 text-center shadow-sm">
                <p className="text-muted-foreground">No books found</p>
              </div>
            ) : (
              books.map((book) => (
                <Form key={book.id} method="post" className="block">
                  <input type="hidden" name="id" value={book.id} />
                  <input
                    type="hidden"
                    name="extension"
                    value={book.extension}
                  />
                  <input type="hidden" name="href" value={book.href} />
                  <div className="rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow">
                    <button className="p-4 flex items-start space-x-4">
                      {book.img && (
                        <img
                          src={
                            book.img === "/img/cover-not-exists.png"
                              ? "https://z-lib.gs/img/cover-not-exists.png"
                              : book.img
                          }
                          alt={book.title || "Book cover"}
                          width={80}
                          height={120}
                          className="object-cover rounded-sm"
                        />
                      )}
                      <div className="flex-1 space-y-2">
                        <div>
                          <h3 className="font-semibold">{book.title}</h3>
                          <p className="text-sm text-gray-600">{book.author}</p>
                          <p className="text-sm text-gray-500">
                            {book.publisher} • {book.year}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {book.language && (
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary text-secondary-foreground">
                              {book.language}
                            </div>
                          )}
                          {book.filesize && (
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors">
                              {book.filesize}
                            </div>
                          )}
                          {book.extension && (
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors">
                              {book.extension}
                            </div>
                          )}
                        </div>

                        {book.note && (
                          <p className="text-sm text-muted-foreground">
                            {book.note}
                          </p>
                        )}
                      </div>
                    </button>
                  </div>
                </Form>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

interface Book {
  id?: string;
  isbn?: string;
  href?: string;
  publisher?: string;
  language?: string;
  year?: string;
  extension?: string;
  filesize?: string;
  rating?: string;
  quality?: string;
  img?: string;
  title?: string;
  author?: string;
  note?: string;
}

function parseBooks(html: string): Book[] {
  const books: Book[] = [];

  // Split the HTML string by z-bookcard opening tags
  const parts = html.split("<z-bookcard");

  // Skip the first part (everything before the first z-bookcard)
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const endIndex = part.indexOf("</z-bookcard>");
    if (endIndex === -1) continue;

    const book: any = {};

    // Extract main attributes
    const attributes = [
      "id",
      "isbn",
      "href",
      "publisher",
      "language",
      "year",
      "extension",
      "filesize",
      "rating",
      "quality",
    ];

    for (const attr of attributes) {
      const match = part.match(new RegExp(`${attr}="([^"]*)"`));
      if (match) book[attr] = match[1];
    }

    // Extract content fields
    const contentFields = {
      img: 'data-src="([^"]*)"',
      title: '<div slot="title"[^>]*>(.*?)</div>',
      author: '<div slot="author"[^>]*>(.*?)</div>',
      note: '<div slot="note"[^>]*>(.*?)</div>',
    };

    for (const [field, pattern] of Object.entries(contentFields)) {
      const match = part.match(new RegExp(pattern));
      if (match) book[field] = match[1].trim();
    }

    books.push(book);
  }

  return books;
}
