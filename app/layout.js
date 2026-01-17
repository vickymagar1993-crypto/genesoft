import Script from 'next/script';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  metadataBase: new URL('https://genesoftinfotech.com'),
  title: 'Genesoft Infotech | B2B Growth Solutions',
  description: 'Transform your business with our cutting-edge B2B solutions. BANT Qualification, Lead Generation, Market Research, and Data Services.',
  keywords: 'B2B, lead generation, BANT, market research, data services, sales development',
  icons: {
    icon: '/uploads/site/favicon-1768415894805-GT LOGO 2.png',
    shortcut: '/uploads/site/favicon-1768415894805-GT LOGO 2.png',
    apple: '/uploads/site/favicon-1768415894805-GT LOGO 2.png',
  },
  openGraph: {
    title: 'Genesoft Infotech | B2B Growth Solutions',
    description: 'Transform your business with our cutting-edge B2B solutions.',
    url: 'https://genesoftinfotech.com',
    siteName: 'Genesoft Infotech',
    images: [
      {
        url: '/uploads/logos/header-logo-1768443799732-GENESOFT INFOTECH FINAL ctc.png',
        width: 800,
        height: 600,
        alt: 'Genesoft Infotech Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Genesoft Infotech | B2B Growth Solutions',
    description: 'Transform your business with our cutting-edge B2B solutions.',
    images: ['/uploads/logos/header-logo-1768443799732-GENESOFT INFOTECH FINAL ctc.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://genesoftinfotech.com',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EHMPVRWR62"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-EHMPVRWR62');
          `}
        </Script>

        {/* Liquid Glass SVG Filter */}
        <svg className="hidden">
          <defs>
            <filter id="liquid">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="liquid" />
            </filter>
          </defs>
        </svg>
        {children}
      </body>
    </html>
  );
}