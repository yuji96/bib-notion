const options = {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    accept: "application/json",
    "Notion-Version": "2022-06-28",
    "content-type": "application/json",
  },
  body: JSON.stringify({
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
  }),
};

fetch("https://api.notion.com/v1/pages", options)
  .then((response) => response.json())
  .then((response) => console.log(response))
  .catch((err) => console.error(err));
