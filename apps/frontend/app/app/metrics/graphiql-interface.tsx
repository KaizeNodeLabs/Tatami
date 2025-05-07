import { GraphiQL } from 'graphiql'
import { Fetcher } from '@graphiql/toolkit'
import 'graphiql/graphiql.min.css'

interface GraphiQLInterfaceProps {
  fetcher?: Fetcher | null
}

export function GraphiQLInterface({ fetcher }: GraphiQLInterfaceProps) {
  if (!fetcher) {
    return (
      <div className="min-h-[600px] xl:h-full w-full border border-dashed border-gray-300 flex items-center justify-center rounded-md text-sm text-muted-foreground text-center px-4">
        ⚠️ No GraphQL endpoint connected. Please enter a valid endpoint above to start exploring the API.
      </div>
    )
  }

  return (
    <div className="min-h-[600px] xl:h-full w-full">
      <GraphiQL fetcher={fetcher} defaultQuery="" />
    </div>
  )
}
