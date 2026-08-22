import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-500 text-center mb-8">
          🌾 AgroLease - Component Library
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Card */}
          <Card>
            <Card.Header>
              <h3 className="text-lg font-semibold text-neutral-800">
                Default Card
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="text-neutral-600">
                This is a default card with shadow.
              </p>
              <p className="text-neutral-600 mt-2">
                Perfect for content display.
              </p>
            </Card.Body>
            <Card.Footer>
              <Button size="sm">Action</Button>
            </Card.Footer>
          </Card>

          {/* Interactive Card */}
          <Card variant="interactive" onClick={() => alert("Card clicked!")}>
            <Card.Image src="" alt="Placeholder" />
            <Card.Body>
              <h3 className="text-lg font-semibold text-neutral-800">
                Interactive Card
              </h3>
              <p className="text-neutral-600 mt-1">Hover me! Click me!</p>
              <p className="text-sm text-primary-500 mt-2">Click anywhere →</p>
            </Card.Body>
          </Card>

          {/* Selected Card */}
          <Card variant="selected">
            <Card.Header>
              <h3 className="text-lg font-semibold text-primary-700">
                Selected Card
              </h3>
            </Card.Header>
            <Card.Body>
              <p className="text-neutral-600">
                This card is selected/highlighted.
              </p>
              <p className="text-sm text-primary-600 mt-2">
                ✓ Currently active
              </p>
            </Card.Body>
          </Card>

          {/* Elevated Card */}
          <Card variant="elevated">
            <Card.Image src="" alt="Elevated card" />
            <Card.Body>
              <h3 className="text-lg font-semibold text-neutral-800">
                Elevated Card
              </h3>
              <p className="text-neutral-600 mt-1">
                Higher shadow for emphasis.
              </p>
              <div className="flex gap-2 mt-3">
                <Button size="sm">Primary</Button>
                <Button size="sm" variant="outline">
                  Secondary
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Card with Form */}
          <Card className="md:col-span-2">
            <Card.Header>
              <h3 className="text-lg font-semibold text-neutral-800">
                Card with Form
              </h3>
            </Card.Header>
            <Card.Body>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="First Name" placeholder="Raj" required />
                <Input label="Last Name" placeholder="Kumar" required />
                <div className="md:col-span-2">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="farmer@example.com"
                    helper="We'll never share your email"
                  />
                </div>
              </div>
            </Card.Body>
            <Card.Footer>
              <Button>Submit</Button>
              <Button variant="ghost" className="ml-2">
                Cancel
              </Button>
            </Card.Footer>
          </Card>
        </div>

        {/* Quick Navigation to Other Components */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-500 mb-3">
            Component Navigation
          </h3>
          <div className="flex flex-wrap gap-2">
            <Button size="sm">Button</Button>
            <Button size="sm" variant="outline">
              Input
            </Button>
            <Button size="sm" variant="primary">
              Card
            </Button>
            <Button size="sm" variant="ghost">
              Badge (Coming Soon)
            </Button>
            <Button size="sm" variant="ghost">
              Avatar (Coming Soon)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
