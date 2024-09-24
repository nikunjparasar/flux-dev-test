// pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import AIPhotoEditor from '../src/components/AIPhotoEditor';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>AI Photo Editor</title>
        <meta name="description" content="A simple AI-powered photo editor built with Next.js and TypeScript." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AIPhotoEditor />
    </>
  );
};

export default Home;
