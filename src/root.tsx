// @refresh reload
import { Suspense } from "solid-js";
import {
  A,
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "./root.css";

const ghHandle = "solidjs-community";
const ghRepoName = "html-to-solidjsx";
const url = `https://${ghHandle}.github.io/${ghRepoName}`;

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>HTML To SolidJSX</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta name="og:title" content="HTML To SolidJSX" />
        <Meta name="og:url" content={url} />
        <Meta name="og:type" content="website" />
        <Meta
          name="description"
          content="Convert your HTML to Solid JSX template"
        />
        <Meta
          name="og:description"
          content="Convert your HTML to Solid JSX template"
        />
        <Meta name="og:image:width" content="1200" />
        <Meta name="og:image:height" content="630" />
        <Meta name="og:image" content={`${url}/og.png`} />
        <Meta name="og:image:url" content={`${url}/og.png`} />
        <Meta name="og:image:secure_url" content={`${url}/og.png`} />
        <Meta name="og:image:alt" content="" />
        <Meta name="twitter:title" content="HTML To SolidJSX" />
        <Meta name="twitter:card" content="summary_large_image" />
        <Meta name="twitter:image" content={`${url}/og.png`} />
        <Meta name="twitter:image:alt" content="" />
        <Meta
          name="twitter:description"
          content="Convert your HTML to Solid JSX template"
        />
        <Link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`/${ghRepoName}/favicons/apple-touch-icon.png`}
        />
        <Link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`/${ghRepoName}/favicons/favicon-32x32.png`}
        />
        <Link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`/${ghRepoName}/favicons/favicon-16x16.png`}
        />
        <Meta
          name="msapplication-TileImage"
          content={`/${ghRepoName}/favicons/ms-icon-144x144.png`}
        />
        <Meta name="msapplication-TileColor" content="#2c4f7c" />
        <Meta name="theme-color" content="#2c4f7c" />
        <Meta name="msapplication-TileColor" content="#2c4f7c" />
        <Meta name="theme-color" content="#2c4f7c" />
        <link
          rel="icon"
          type="image/png"
          href={`/${ghRepoName}/favicons/favicon-32x32.png`}
        />
        <script>{`
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        `}</script>
      </Head>
      <Body>
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
