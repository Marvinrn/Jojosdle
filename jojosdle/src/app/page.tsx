import Link from "next/link";

export default function Home() {
  return (
    <main>
      <div>
        <Link href="/characters">
          <button>Go to Characters Page</button>
        </Link>
      </div>
    </main>
  );
}
