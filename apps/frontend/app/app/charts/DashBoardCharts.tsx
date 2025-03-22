import { ModelsChart } from "./ModelsChart";
import { TransactionsChart } from "./TransactionsChart";

export function DashboardCharts() {
  return (
    <div className="flex flex-col gap-4">
      <ModelsChart />
      <TransactionsChart />
    </div>
  );
}
