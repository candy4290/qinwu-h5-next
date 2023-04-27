import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import '@/utils/axios';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import Head from 'next/head';
import Layout from '@/components/layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <Head>
        <title>市局轻应用</title>
        <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="description" content="mit-frontend" />
        <meta httpEquiv="cache-control" content="no-cache" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
