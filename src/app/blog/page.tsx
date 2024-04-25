/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import Image from "next/image";
import Link from "next/link";
import util from "util";
import { Card } from "~/components/ui/card";
import { getPages } from "../_utils/notion";

export default async function AllPOsts() {
  const pages = await getPages().then((data) =>
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

  console.log(
    util.inspect(pages, { showHidden: false, depth: null, colors: true }),
  );

  return (
    <main className="flex min-h-screen flex-col items-center justify-start text-2xl text-black">
      <h1 className="px-4 py-8 text-center text-7xl text-slate-900">בלוג</h1>
      <section className="flex w-full flex-row flex-wrap items-start justify-center gap-x-[1%] gap-y-4 p-4">
        {pages.map((page) => (
          <Link
            key={page.slug}
            href={`/blog/${page.slug}`}
            className="min-w-[400px] max-w-[30%]"
          >
            <Card className="flex cursor-pointer flex-col items-center justify-start gap-2 p-4">
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
            </Card>
          </Link>
        ))}
      </section>
    </main>
  );
}
