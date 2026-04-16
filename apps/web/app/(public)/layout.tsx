import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

// Layout partagé par toutes les pages publiques (navbar + footer)
// Le groupe (public) n'affecte pas les URLs
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
