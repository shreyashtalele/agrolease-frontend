import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";

function App() {
  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-500 text-center mb-8">
          🌾 AgroLease - Component Library
        </h1>

        {/* Badge Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold text-neutral-800">
              Badge Component
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="info">Info</Badge>
            </div>
            <div className="flex flex-wrap gap-3 mt-4">
              <Badge withDot>Default</Badge>
              <Badge variant="primary" withDot>
                Primary
              </Badge>
              <Badge variant="success" withDot>
                Success
              </Badge>
              <Badge variant="warning" withDot>
                Warning
              </Badge>
              <Badge variant="error" withDot>
                Error
              </Badge>
              <Badge variant="info" withDot>
                Info
              </Badge>
            </div>
          </Card.Body>
        </Card>

        {/* Avatar Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold text-neutral-800">
              Avatar Component
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-wrap items-center gap-4">
              <Avatar size="xs" fallback="JD" />
              <Avatar size="sm" fallback="RK" />
              <Avatar size="md" fallback="SP" />
              <Avatar size="lg" fallback="AS" />
              <Avatar size="xl" fallback="VP" />
              <Avatar size="2xl" fallback="PS" />
            </div>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <Avatar src="https://i.pravatar.cc/150?img=1" alt="User 1" />
              <Avatar src="https://i.pravatar.cc/150?img=2" alt="User 2" />
              <Avatar src="https://i.pravatar.cc/150?img=3" alt="User 3" />
              <Avatar src="" fallback="JD" />
            </div>
          </Card.Body>
        </Card>

        {/* Component Navigation */}
        <div className="mt-8 p-4 bg-white rounded-xl border border-neutral-200">
          <h3 className="text-sm font-medium text-neutral-500 mb-3">
            Components Built
          </h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="success">✅ Button</Badge>
            <Badge variant="success">✅ Input</Badge>
            <Badge variant="success">✅ Card</Badge>
            <Badge variant="success">✅ Badge</Badge>
            <Badge variant="success">✅ Avatar</Badge>
            <Badge variant="warning">⏳ Modal</Badge>
            <Badge variant="warning">⏳ Toast</Badge>
            <Badge variant="warning">⏳ LoadingSpinner</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
