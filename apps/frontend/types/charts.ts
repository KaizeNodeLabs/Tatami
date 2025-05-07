import type { TooltipProps } from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";

export type CustomTooltipProps = TooltipProps<ValueType, NameType>;

export interface ModelInfo {
  name: string
  namespace: string
}

export interface ModelDataItem {
  name: string
  value: number
  color: string
}

export interface TransactionDataPoint {
  date: string
  value: number
}
