import Link from "next/link";

export default function GamesPage() {
    return <>
        <p>Games</p>

        <Link href={'/teacher/games/create'}>Create</Link>

    </>
}