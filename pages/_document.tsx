import { Html, Head, Main, NextScript } from 'next/document';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'sss',
  description: 'xxxx',
};
export default function Document() {
  return (
    <Html lang="en">
      <Head>{/* <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" /> */}</Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
