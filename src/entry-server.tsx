import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
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
          <App location={url} />
        </QueryClientProvider>
      </HelmetProvider>
    </React.StrictMode>
  )

  return { html, helmetContext }
}
