import './global.css';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata = {
  title: 'BidyaGo | Find, Match & Win Global Scholarships Worldwide',
  description:
    'Discover over $120M in verified academic grants and scholarships on BidyaGo. Match instantly with eligibility filters tailored to your degree, country, and goals.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} scroll-smooth`}>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white text-slate-900 antialiased selection:bg-primary-100 selection:text-primary-700"
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
