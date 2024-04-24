"use server";
import { type z } from "zod";
import { notionClient } from "~/app/_utils/notion";
import { env } from "~/env";
import { type formSchema } from "./ContactUsForm";

export const addLeadToNotion = async ({
  name,
  email,
  text,
}: z.infer<typeof formSchema>) => {
  const notionCRMTableID = env.NOTION_CRM_DB_ID;
  if (!notionCRMTableID || !notionClient || !name || !email || !text)
    throw new Error("שמירת הנתונים נכשלה. נא לנסות שוב מאוחר יותר.");

  await notionClient.pages.create({
    parent: {
      type: "database_id",
      database_id: notionCRMTableID,
    },
    properties: {
      Name: {
        title: [
          {
            type: "text",
            text: {
              content: name,
            },
          },
        ],
      },
      Email: {
        email,
      },
      Text: {
        rich_text: [
          {
            type: "text",
            text: {
              content: text,
            },
          },
        ],
      },
      Status: {
        select: {
          name: "Not started",
        },
      },
      "Created at": {
        date: {
          start: new Date().toISOString(),
        },
      },
    },
  });
};
