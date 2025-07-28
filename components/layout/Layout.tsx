import Header from "@/components/layout/Header";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="min-h-screen bg-background text-white">
            <Header />
            <main className="pt-15">{children}</main>
        </div>
    );
}
