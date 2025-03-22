import { ModelsChart } from "./ModelsChart";
import { TransactionsChart } from "./TransactionsChart";

export function DashboardCharts() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ModelsChart />
      <TransactionsChart />
    </div>
  );
}
