import MainHeader from '@/components/main-header';
import BottomNavBar from '@/components/bottom-nav-bar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <MainHeader />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <BottomNavBar />
    </div>
  );
}
