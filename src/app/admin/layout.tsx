import Sidebar from "@/components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-auto py-4 px-2 mt-12 md:mt-0">
        {/* Render the children (content of each route) */}
        {children}
      </main>
    </div>
  );
}
