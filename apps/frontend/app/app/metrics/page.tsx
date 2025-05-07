'use client'

import { useState } from "react"
import { gql } from "@apollo/client"

import { GraphQLEndpointForm } from "@/app/app/metrics/graphql-endpoint-form"
import { GraphiQLInterface } from "@/app/app/metrics/graphiql-interface"
import { ModelsChart } from "@/app/app/metrics/models-chart"
import { TransactionsChart } from "@/app/app/metrics/transactions-chart"
import { useGraphQLConnection } from "@/hooks/use-graphql-connection"
import { useToast } from "@/hooks/use-toast"
import { createApolloClient } from "@/lib/apollo-client"
import { GET_ALL_MODELS_DATA, GET_TRANSACTIONS } from "@/lib/graphql/metrics.queries"
import type { ModelDataItem, ModelInfo, TransactionDataPoint } from "@/types/charts"
import clsx from "clsx"

import { mockModelsResponse, mockTransactionsResponse } from "./mock-metrics"

export default function MetricsPage() {
  const [modelsData, setModelsData] = useState<ModelDataItem[] | null>(null)
  const [transactionsData, setTransactionsData] = useState<TransactionDataPoint[] | null>(null)
  const [hasFetched, setHasFetched] = useState(false)
  const [endpoint, setEndpoint] = useState<string>("")

  const { toast } = useToast()
  const { connect, fetcher } = useGraphQLConnection((msg) => {
    toast({
      title: "Connection Error",
      description: msg,
      variant: "destructive",
    })
  })

  const handleSetEndpoint = (url: string) => {
    if (url !== endpoint) {
      setHasFetched(false)
      setModelsData(null)
      setTransactionsData(null)
    }

    setEndpoint(url)
    connect(url)
  }

  const onLoadMetrics = async () => {
    if (!endpoint) {
      toast({
        title: "Missing Endpoint",
        description: "Please provide a valid API URL before loading metrics.",
        variant: "destructive",
      })
      return
    }

    const client = createApolloClient(endpoint)

    try {
      // MODELS
      let generatedModelsData: ModelDataItem[] = []

      try {
        const modelsResult = await client.query({ query: GET_ALL_MODELS_DATA })
        const modelsEdges = modelsResult.data.models.edges

        if (modelsEdges.length === 0) throw new Error("Empty models edges")

        const modelsList: ModelInfo[] = modelsEdges.map((edge: any) => ({
          name: edge.node.name,
          namespace: edge.node.namespace,
        }))

        const modelQueries = modelsList.map(async ({ name, namespace }: ModelInfo, index: number) => {
          const modelKey = `${namespace}${name}Models`
          const dynamicQuery = gql`query { ${modelKey} { totalCount } }`
          const res = await client.query({ query: dynamicQuery })
          return {
            name,
            value: res.data?.[modelKey]?.totalCount ?? 0,
            color: `hsl(47, 93%, ${53 + index * 7}%)`,
          }
        })

        generatedModelsData = await Promise.all(modelQueries)
      } catch {
        const mockEdges = mockModelsResponse.data.models.edges
        generatedModelsData = mockEdges.map((edge: any, index: number) => {
          const modelKey = `${edge.node.namespace}${edge.node.name}Models`
          const value = (mockModelsResponse.data as any)[modelKey]?.totalCount ?? 0
          return {
            name: edge.node.name,
            value,
            color: `hsl(47, 93%, ${53 + index * 7}%)`,
          }
        })
      }

      setModelsData(generatedModelsData)

      // TRANSACTIONS
      try {
        const transactionsResult = await client.query({ query: GET_TRANSACTIONS })
        const txEdges = transactionsResult.data.transactions.edges

        const txSource = txEdges.length > 0
          ? txEdges
          : mockTransactionsResponse.data.transactions.edges

        const transformedTransactions = txSource.map((edge: any) => ({
          date: edge.node.id.slice(0, 7),
          value: parseInt(edge.node.calldata?.length ?? 0),
        })).slice(0, 12)

        setTransactionsData(transformedTransactions)
      } catch {
        const fallbackTransactions = mockTransactionsResponse.data.transactions.edges.map((edge: any) => ({
          date: edge.node.id.slice(0, 7),
          value: parseInt(edge.node.calldata?.length ?? 0),
        }))

        setTransactionsData(fallbackTransactions)
      }

      setHasFetched(true)
    } catch {
      toast({
        title: "Error loading metrics",
        description: "Something went wrong while fetching metrics.",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="space-y-6 px-4">
      <GraphQLEndpointForm onSetEndpoint={handleSetEndpoint} onLoadMetrics={onLoadMetrics} />

      <div className="grid grid-cols-1 xl:grid-cols-3 pb-4 xl:pb-0 gap-6">
        <div
          className={clsx(
            "row-span-2",
            hasFetched ? "col-span-1 xl:col-span-2" : "col-span-1 xl:col-span-3"
          )}
        >
          <GraphiQLInterface fetcher={fetcher} />
        </div>

        {hasFetched && (
          <>
            <ModelsChart data={modelsData} />
            <TransactionsChart data={transactionsData} />
          </>
        )}
      </div>
    </main>
  )
}
