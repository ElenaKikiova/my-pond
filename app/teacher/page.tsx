import Link from "next/link";

export default function TeacherPage() {
    return <><p>
        Teacher</p>

        <Link href={'/teacher/games/create'}>Create</Link>

    </>
}