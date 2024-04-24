"use server";
import { Client } from "@notionhq/client";
import { type z } from "zod";
import { env } from "~/env";
import { type formSchema } from "./ContactUsForm";

export const addLeadToNotion = async ({
  name,
  email,
  text,
}: z.infer<typeof formSchema>) => {
  const notion = new Client({
    auth: env.NOTION_INTEGRATION_SECRET,
  });
  const notionCRMTableID = env.NOTION_CRM_DB_ID;
  if (!notionCRMTableID)
    throw new Error("שמירת הנתונים נכשלה. נא לנסות שוב מאוחר יותר.");

  await notion.pages.create({
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
