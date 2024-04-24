import Image from "next/image";

interface PostProps {
  title: string;
  bannerImage: string;
  bannerImageWidth: number;
  bannerImageHeight: number;
  content: string;
}

export function Post(props: PostProps) {
  const { title, content, bannerImage, bannerImageWidth, bannerImageHeight } =
    props;

  return (
    <article className="mb-10 flex w-full flex-col items-center pt-20">
      <h1 className="mb-8 text-6xl font-black text-black">{title}</h1>
      <Image
        alt="Blog Image"
        src={bannerImage}
        width={bannerImageWidth}
        height={bannerImageHeight}
        className="[width: 800px]!"
      />
      <div
        className="prose prose-p:text-white prose-headings:text-black mt-4 max-w-3xl space-y-4 text-xl leading-10"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </article>
  );
}
