import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '@/utils/axios';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { usePathname } from 'next/navigation';
import BottomTabs from '@/components/bottom-tabs';
import Head from 'next/head';

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const mainPage = pathname?.startsWith('/home/');
  return (
    <Provider store={store}>
      <Head>
        <title>市局轻应用</title>
        <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="mit-frontend" />
        <meta http-equiv="cache-control" content="no-cache" />
      </Head>
      <div className={mainPage ? 'h-[calc(100vh-56px)] bg-[#f9f9f9] overflow-y-auto' : 'h-screen'}>
        <Component {...pageProps} />
      </div>
      {
        mainPage &&
        <BottomTabs />
      }
    </Provider>
  )
}
