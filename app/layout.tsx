import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Providers } from './components/Providers';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'KaliAcademy',
  description: 'Plataforma de treinamento em cibersegurança.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
