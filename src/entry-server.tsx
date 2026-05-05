import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StaticRouter } from 'react-router-dom/server'
import App from './App'

export function render(url: string, context: Record<string, unknown>) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
      },
    },
  })

  const helmetContext = {}

  const html = ReactDOMServer.renderToString(
    <React.StrictMode>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <StaticRouter location={url}>
            <App queryClient={queryClient} />
          </StaticRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  )

  return { html, helmetContext }
}

