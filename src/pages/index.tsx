import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard
    router.push('/');
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cco-neutral-50">
      <Head>
        <title>CCO VibeCoder Platform</title>
        <meta name="description" content="Your AI-powered assistant for software development" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="w-12 h-12 bg-gradient-to-br from-cco-primary-500 to-cco-accent-500 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4">
          CCO
        </div>
        <h1 className="text-3xl font-bold mb-2">
          CCO VibeCoder Platform
        </h1>
        <p className="text-lg text-cco-neutral-600 mb-8">
          Redirecting to dashboard...
        </p>
        <div className="w-8 h-8 border-4 border-cco-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </main>
    </div>
  );
} 