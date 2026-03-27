import { db } from "@/db";
import { users } from "@/db/schema";

export default async function Home() {
  const userall = await db.select().from(users);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {JSON.stringify(userall)}
    </div>
  );
}
