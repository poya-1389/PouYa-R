import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PouYa',
  description: 'PouYa — Developer. Iran, Rasht.',
  metadataBase: new URL('https://pouya-nu.vercel.app'), // آدرس واقعی سایتت
  openGraph: {
    title: 'PouYa',
    description: 'PouYa — Developer. Iran, Rasht.',
    url: 'https://pouya-nu.vercel.app',
    siteName: 'PouYa',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};
export const metadata: Metadata = {
  ...
  verification: {
    google: 'Hku3miZ0121oMIf_sSIJWKC2bauG4TnU00_C4FNkA5U', // فقط همون content رو بذار، نه کل تگ
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
