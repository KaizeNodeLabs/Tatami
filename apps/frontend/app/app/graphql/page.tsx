import { GraphQLExplorer } from "@/components/app/graphql/graphql-explorer";

export default function GraphQLPage() {
  return (
    <main className="max-w-7xl mx-auto px-2">
      <h1 className="text-3xl font-bold mb-6 text-white">GraphQL Explorer</h1>
      <GraphQLExplorer />
    </main>
  )
}
