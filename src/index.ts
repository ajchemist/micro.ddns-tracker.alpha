import { Client } from '@notionhq/client';
import type { QueryDatabaseParameters, PageObjectResponse, RichTextItemResponse } from '@notionhq/client/build/src/api-endpoints';

// fns

// native environment variables feeding with .env file
const notion = new Client({
    auth: process.env.NOTION_TOKEN
})

const getAllPages = async (params: QueryDatabaseParameters) => {
    let pages = [];
    let has_more = false;
    do {
        const response = await notion.databases.query(params);
        pages.push(...response.results);
        params.start_cursor = response.next_cursor || undefined;
        has_more = response.has_more;
    } while (has_more);

    return pages;
}

// types

interface Page extends PageObjectResponse {
    properties: {
        domain: {
            type: "title";
            title: Array<RichTextItemResponse>;
            id: string;
        },
        ipv4: {
            type: "rich_text";
            rich_text: Array<RichTextItemResponse>;
            id: string;
        }
    }
}

// play

const pages = await getAllPages({
    database_id: process.env.NOTION_DATABASE_ID!
});

pages.forEach(page => {
    const typedPage = page as Page;
    // const domain = typedPage.properties.domain.title?.[0].plain_text;
    // const ipv4 = typedPage.properties.ipv4.rich_text?.[0]?.plain_text
    // console.log(domain, ipv4)
})
