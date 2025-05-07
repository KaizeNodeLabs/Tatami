'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  endpoint: z.string().url('Must be a valid URL').refine((url) =>
    url.startsWith('http://') || url.startsWith('https://'), {
    message: 'Endpoint must start with http:// or https://',
  })
})

type FormValues = z.infer<typeof formSchema>

interface GraphQLEndpointFormProps {
  onSetEndpoint: (endpoint: string) => void
  onLoadMetrics: () => void
}

export function GraphQLEndpointForm({ onSetEndpoint, onLoadMetrics }: GraphQLEndpointFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { endpoint: '' },
  })

  const onSubmit = (data: FormValues) => {
    onSetEndpoint(data.endpoint)
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col xl:flex-row gap-4 items-start xl:items-end">
          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <FormItem className="flex-1 w-full">
                <FormLabel className="text-foreground font-semibold">GraphQL Endpoint</FormLabel>
                <FormControl>
                  <Input className="text-black" placeholder="https://api.example.com/graphql" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 w-full xl:w-auto">
            <Button
              type="submit"
              className="w-full xl:w-auto bg-primary text-black py-3 px-6 rounded-md hover:bg-primary/85"
            >
              Connect
            </Button>
            <Button
              type="button"
              className="w-full xl:w-auto text-black"
              onClick={onLoadMetrics}
            >
              Metrics
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
