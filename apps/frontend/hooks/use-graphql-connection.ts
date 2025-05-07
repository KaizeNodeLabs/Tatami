import { useState } from 'react'
import {
  createGraphiQLFetcher,
  Fetcher,
  FetcherParams,
  FetcherOpts,
} from '@graphiql/toolkit'

interface UseGraphQLConnection {
  fetcher: Fetcher | null
  error: string | null
  connect: (endpoint: string) => void
  query: string | null
  response: Record<string, unknown> | Record<string, unknown>[] | null
}

/**
 * Custom hook to connect to a GraphQL endpoint and track queries/responses
 */
export function useGraphQLConnection(onError?: (msg: string) => void): UseGraphQLConnection {
  const [fetcher, setFetcher] = useState<Fetcher | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [query, setQuery] = useState<string | null>(null)
  const [response, setResponse] = useState<
    Record<string, unknown> | Record<string, unknown>[] | null
  >(null)

  /**
   * Connects to the given GraphQL endpoint and sets up a custom fetcher
   */
  const connect = async (endpoint: string) => {
    try {
      // Clear GraphiQL tab/session state from localStorage
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('graphiql:')) {
          localStorage.removeItem(key)
        }
      })

      // Check if the endpoint responds
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: '{ __typename }' }),
      })

      if (!response.ok) {
        throw new Error('Invalid GraphQL endpoint')
      }

      const graphiqlFetcher = createGraphiQLFetcher({ url: endpoint })

      const customFetcher: Fetcher = async (params: FetcherParams, opts?: FetcherOpts) => {
        const currentQuery = params.query ?? ''

        // Skip introspection queries from affecting the response
        if (currentQuery.includes('__schema') && currentQuery.includes('__Type')) {
          return graphiqlFetcher(params, opts)
        }

        setQuery(currentQuery)

        const result = await graphiqlFetcher(params, opts)

        // Handle async iterable results (e.g. subscriptions)
        if (Symbol.asyncIterator in Object(result)) {
          const results: Record<string, unknown>[] = []
          for await (const chunk of result as AsyncIterable<Record<string, unknown>>) {
            results.push(chunk)
          }

          setResponse(results)

          // Reconstruct iterable for GraphiQL to display
          async function* replay() {
            for (const r of results) {
              yield r
            }
          }

          return replay()
        }

        // Handle standard single-result queries
        const cloned = structuredClone(result)
        setResponse(cloned as Record<string, unknown>)
        return result
      }

      setFetcher(() => customFetcher)
      setError(null)
    } catch {
      const message = 'Failed to connect to the GraphQL endpoint.'
      setError(message)
      setFetcher(null)

      if (onError) {
        onError(message)
      }
    }
  }

  return {
    fetcher,
    error,
    connect,
    query,
    response,
  }
}
