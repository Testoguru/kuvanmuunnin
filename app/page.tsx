import Link from "next/link";
import { CONVERSIONS } from "../conversion-data";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-white px-4 py-12 font-sans dark:from-zinc-950 dark:to-black sm:px-6">
      <section className="mx-auto w-full max-w-5xl">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-lg shadow-zinc-200/60 dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-black/20 sm:p-10">
          <p className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
            100 % selaimessa toimiva kuvanmuunnin
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-100 sm:text-4xl">
            Suomen helpoin ilmainen kuvanmuunnin
          </h1>
          <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Valitse haluamasi muunnos alta ja muuta kuvia nopeasti ilman asennuksia. Kaikki tapahtuu turvallisesti suoraan selaimessasi.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONVERSIONS.map((conversion) => (
            <Link
              key={conversion.slug}
              href={`/${conversion.slug}`}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-blue-700"
            >
              <p className="text-lg font-semibold text-zinc-900 group-hover:text-blue-700 dark:text-zinc-100 dark:group-hover:text-blue-300">
                {conversion.from.replace("image/", "").toUpperCase()} -&gt;{" "}
                {conversion.to.replace("image/", "").toUpperCase()}
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{conversion.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

