import ReactQueryProvider from '@/components/common/ReactQueryProvider';
import ThemeProviderWrapper from '@/components/common/ThemeProviderWrapper';
import GlobalStyle from '@/styles/global';
import Script from 'next/script';

export const metadata = {
  title: 'mema',
  description: '모임을 더 쉽게 meet mate, mema',
  keywords: 'mema, 메마, meet mate, 모임 약속 조율, 약속 조율, 정산, 엔빵, 일정 조율, 모임 관리',
  icons: {
    icon: '/favicon.ico',
    apple: '/images/puzzleWithBoxLogo.png',
  },
  openGraph: {
    title: 'mema',
    description: '모임을 더 쉽게 meet mate, mema',
    images: [
      {
        url: '/images/puzzleLogo.png',
        width: 800,
        height: 600,
        alt: 'mema',
      },
    ],
    url: 'https://meet-mate-mema.vercel.app',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'mema',
    description: '모임을 더 쉽게 meet mate, mema',
    images: ['/images/puzzleWithBoxLogo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <Script
        strategy="afterInteractive"
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.REACT_APP_MAP_KEY}`}
      ></Script>
      <body>
        <ReactQueryProvider>
          <ThemeProviderWrapper>
            <GlobalStyle />
            {children}
          </ThemeProviderWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
