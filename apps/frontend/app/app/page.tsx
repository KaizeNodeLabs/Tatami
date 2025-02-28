import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AppPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Tatami App</h1>
      <p className="mb-8">This is the main Tatami UI page.</p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
