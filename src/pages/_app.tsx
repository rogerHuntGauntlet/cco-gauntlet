import '../styles/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        /* Stripe Buy Button custom styling */
        :root {
          --electric-indigo: #6366f1;
        }
        
        .dark {
          --electric-indigo: #818cf8;
        }
        
        stripe-buy-button {
          --sb-border-radius: 0.375rem;
          --sb-font-family: inherit;
          --sb-shadow: none;
          width: 100%;
        }
        
        stripe-buy-button .buy-button-purchase {
          background-color: var(--electric-indigo) !important;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp; 