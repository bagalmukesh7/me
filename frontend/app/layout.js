import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../lib/auth';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'UGOVA - Unified Government Opportunities & Verification App',
  description: 'Central digital gateway connecting citizens with government opportunities in a smart, automated, and transparent way.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
