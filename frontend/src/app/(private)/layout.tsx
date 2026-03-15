import PrivateSideBar from "@/components/Navbar/PrivateSideBar"
import PrivateTopBar from "@/components/Navbar/PrivateTopBar"

export default function PrivateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-background">
      <PrivateSideBar />
      <main className="flex-1 dark:bg-black min-h-screen flex flex-col min-w-0">
        <PrivateTopBar />
        <div className="flex-1 p-4 md:p-6 dark:bg-black">
          {children}
        </div>
      </main>
    </div>
  );
}
