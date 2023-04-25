import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '@/utils/axios';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { usePathname } from 'next/navigation';
import BottomTabs from '@/components/bottom-tabs';

export default function App({ Component, pageProps }: AppProps) {
  const pathname = usePathname();
  const mainPage = pathname?.startsWith('/home/');
  return (
    <Provider store={store}>
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
