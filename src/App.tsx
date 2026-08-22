import { Button } from "@/components/common/Button";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center space-y-6 max-w-2xl mx-auto p-4">
        <h1 className="text-4xl font-bold text-primary-500">🌾 AgroLease</h1>
        <p className="text-neutral-600">Button Component Demo</p>

        <div className="space-y-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-400">
            Variants
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-400">
            Sizes
          </h3>
          <div className="flex flex-wrap gap-3 justify-center items-center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-400">
            States
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button loading>Loading</Button>
            <Button disabled>Disabled</Button>
            <Button fullWidth>Full Width</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
