import TeacherMenu from "@/features/teacher/components/TeacherMenu";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <TeacherMenu />
            {children}
        </>
    );
}