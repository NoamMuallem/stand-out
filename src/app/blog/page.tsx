/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import Link from "next/link";
import { Card } from "~/components/ui/card";
import { env } from "~/env";
import { getPages } from "../_utils/notion";

export default async function AllPosts() {
  const pages = await getPages({
    databaseID: env.NOTION_BLOG_POSTS_DB_ID,
  }).then((data) =>
    data.results
      //@ts-expect-error: Notion does not supply a full type coverage for it's tables
      .map(({ properties }) => {
        return {
          title: properties.Title.title[0].plain_text,
          slug: properties.Slug.rich_text[0].plain_text,
          image: properties.BannerImage.url,
          description: properties.Description.rich_text[0].plain_text,
          imageWidth: properties.BannerImageWidth.number,
          imageHeight: properties.BannerImageHeight.number,
        };
      })
      .reverse(),
  );

  return (
    <main className="mx-auto flex min-h-screen max-w-screen-2xl flex-col items-center justify-start text-2xl text-black">
      <h1 className="px-4 py-8 text-center text-7xl text-slate-900">בלוג</h1>
      <section className="columns-1 gap-x-4 space-y-4 p-4 sm:columns-2 md:columns-3">
        {pages.map((page) => (
          <Card
            key={page.slug}
            className="flex cursor-pointer break-inside-avoid flex-col items-center justify-start gap-2 p-4"
          >
            <Link href={`/blog/${page.slug}`}>
              <h2 className="px-4 text-xl font-bold text-slate-900">
                {page.title}
              </h2>
              <Image
                src={page.image}
                height={page.imageHeight}
                width={page.imageWidth}
                alt={page.title}
              />
              <p className="text-sm font-bold text-slate-600">
                {page.description}
              </p>
            </Link>
          </Card>
        ))}
      </section>
    </main>
  );
}
