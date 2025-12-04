import MainHeader from '@/components/main-header';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full bg-background">
      <MainHeader />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
