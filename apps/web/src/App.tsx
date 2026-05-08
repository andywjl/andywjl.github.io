import { Button } from "@/components/ui/button";

export function App() {
  return (
    <main className="bg-slate-900 text-slate-50 min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">Hello Globe</h1>
        <Button variant="secondary">shadcn/ui ready</Button>
      </div>
    </main>
  );
}
