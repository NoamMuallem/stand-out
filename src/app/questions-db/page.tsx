/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { env } from "~/env";
import { getPages } from "../_utils/notion";
import { QuestionsCards } from "./components/QuestionsCards";

export type Question = {
  question: string;
  company?: string;
  subject?: string;
  id: string;
  lastEditedTime: string;
};

export default async function AllQuestions() {
  const questions = await getPages({
    databaseID: env.NOTION_QUESTIONS_DB_ID,
  }).then((data) =>
    data.results
      //@ts-expect-error: Notion does not supply a full type coverage for it's tables
      .map(({ properties, id }) => {
        return {
          question: properties.Question.rich_text[0].text.content,
          company: properties.Company.select?.name,
          subject: properties.Subject.select?.name,
          lastEditedTime: properties["Last edited time"].last_edited_time,
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
      <QuestionsCards questions={questions} />
    </main>
  );
}
