import { ApolloClient, InMemoryCache } from '@apollo/client';

export function createApolloClient(uri: string) {
  return new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });
}
