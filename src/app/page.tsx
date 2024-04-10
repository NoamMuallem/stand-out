import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center text-2xl text-black">
      <div className="flex min-h-full flex-col items-center justify-center">
        מקום טוב להתחיל בו 💪
        <div className="flex flex-col items-center gap-2">
          <p>{hello ? hello.greeting : "Loading tRPC query..."}</p>
        </div>
      </div>
    </main>
  );
}
