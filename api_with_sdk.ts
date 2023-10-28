import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

(async () =>
  await notion.pages
    .create({
      parent: { database_id: process.env.DATABASE_ID! },
      properties: {
        Title: { title: [{ text: { content: "title" } }] },
        "Author(s)": {
          rich_text: [{ type: "text", text: { content: "authors" } }],
        },
        Booktitle: { rich_text: [{ type: "text", text: { content: "book" } }] },
        Year: { number: 2021 },
        URL: { url: "url" },
        PDF: { url: "pdf" },
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    }))();
