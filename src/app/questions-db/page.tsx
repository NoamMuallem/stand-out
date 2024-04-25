/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { env } from "~/env";
import { getPages } from "../_utils/notion";

export default async function AllPOsts() {
  const pages = await getPages({
    databaseID: env.NOTION_QUESTIONS_DB_ID,
  }).then((data) =>
    data.results
      //@ts-expect-error: Notion does not supply a full type coverage for it's tables
      .map(({ properties, id }) => {
        return {
          question: properties.Question.rich_text[0].text.content,
          company: properties.Company.select?.name,
          id,
        };
      })
      .reverse(),
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-screen-2xl flex-col items-center justify-start text-2xl text-black">
      <h1 className="px-4 py-8 text-center text-7xl text-slate-900">
        מאגר שאלות
      </h1>
      <section className="columns-1 gap-x-4 space-y-4 p-4 sm:columns-2 md:columns-3">
        {pages.map((page) => (
          <Card
            key={page.id}
            className="flex break-inside-avoid flex-col items-center justify-start gap-2 p-4"
          >
            {page.company ? (
              <Badge variant="outline" className="ml-auto">
                {page.company}
              </Badge>
            ) : null}
            <h2>{page.question}</h2>
          </Card>
        ))}
      </section>
    </main>
  );
}
