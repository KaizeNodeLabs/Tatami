'use client'

import { useState } from "react"

import { GraphQLEndpointForm } from "@/components/metrics/graphql-endpoint-form"
import { GraphiQLInterface } from "@/components/metrics/graphiql-interface"
import { ModelsChart } from "@/components/metrics/models-chart"
import { TransactionsChart } from "@/components/metrics/transactions-chart"
import { useGraphQLConnection } from "@/hooks/use-graphql-connection"
import { useToast } from "@/hooks/use-toast"
import { createApolloClient } from "@/lib/apollo-client"
import { GET_ALL_MODELS_DATA, GET_TRANSACTIONS } from "@/lib/graphql/metrics.queries"
import type { ModelDataItem, TransactionDataPoint } from "@/types/charts"

export default function MetricsPage() {
  const [modelsData, setModelsData] = useState<ModelDataItem[] | null>(null)
  const [transactionsData, setTransactionsData] = useState<TransactionDataPoint[] | null>(null)
  const { toast } = useToast()

  const { connect, fetcher } = useGraphQLConnection((msg) => {
    toast({
      title: "Connection Error",
      description: msg,
      variant: "destructive",
    })
  })

  const onLoadMetrics = async () => {
    const client = createApolloClient("https://api.cartridge.gg/x/hhbbb/torii/graphql")

    try {
      const results = await Promise.all([
        client.query({ query: GET_ALL_MODELS_DATA }),
        client.query({ query: GET_TRANSACTIONS }),
      ])

      console.log("✅ All metrics loaded")
      results.forEach((r, i) => {
        console.log(`📊 Query ${i + 1}`, r.data)
      })

      // Extract real data
      const modelsResponse = results[0].data // GET_All_MODELS_DATA
      const transactionsResponse = results[1].data // GET_TRANSACTIONS

      const modelsData = [
        { name: modelsResponse.models.edges[3].node.name, value: modelsResponse.tamagotchiPlayerModels.totalCount, color: "#FEB913" },
        { name: modelsResponse.models.edges[1].node.name, value: modelsResponse.tamagotchiBeastModels.totalCount, color: "#FFCB47" },
        { name: modelsResponse.models.edges[2].node.name, value: modelsResponse.tamagotchiFoodModels.totalCount, color: "#FFD670" },
        { name: modelsResponse.models.edges[0].node.name, value: modelsResponse.tamagotchiBeastStatusModels.totalCount, color: "#FFE299" },
      ]

      setModelsData(modelsData)

      const transformedTransactions = transactionsResponse.transactions.edges.map((edge: any) => ({
        date: edge.node.id.slice(0, 6), // only to simulate
        value: parseInt(edge.node.calldata?.length ?? 0),
      })).slice(0, 12) // we take 12 values

      setTransactionsData(transformedTransactions)
    } catch (error) {
      toast({
        title: "Error loading metrics",
        description: "Something went wrong while fetching metrics.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="space-y-6 px-4">
      <GraphQLEndpointForm connect={connect} onLoadMetrics={onLoadMetrics} />

      <div className="grid grid-cols-1 xl:grid-cols-3 pb-4 xl:pb-0 gap-6">
        <div className="col-span-1 xl:col-span-2 row-span-2">
          <GraphiQLInterface fetcher={fetcher} />
        </div>

        <ModelsChart data={modelsData} />
        <TransactionsChart data={transactionsData} />
      </div>
    </main>
  )
}
