import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { Avatar } from "@/components/common/Avatar";
import { Modal } from "@/components/common/Modal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-500 text-center mb-8">
          🌾 AgroLease - Component Library
        </h1>

        {/* Modal Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold text-neutral-800">
              Modal Component
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              <Button
                variant="danger"
                onClick={() => setIsConfirmModalOpen(true)}
              >
                Open Confirm Modal
              </Button>
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
            <Badge variant="success">✅ Modal</Badge>
            <Badge variant="warning">⏳ Toast</Badge>
            <Badge variant="warning">⏳ LoadingSpinner</Badge>
          </div>
        </div>
      </div>

      {/* Standard Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Sample Modal"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button fullWidth onClick={() => setIsModalOpen(false)}>
              Save Changes
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-neutral-600">
            This is a sample modal. You can put any content here.
          </p>
          <Input
            label="Email Address"
            type="email"
            placeholder="farmer@example.com"
            helper="We'll never share your email"
          />
          <Input label="Message" placeholder="Enter your message" />
        </div>
      </Modal>

      {/* Confirm Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        title="Confirm Delete"
        maxWidth="sm"
        footer={
          <>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => setIsConfirmModalOpen(false)}
            >
              Delete
            </Button>
          </>
        }
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-error-50 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
            ⚠️
          </div>
          <div>
            <p className="font-medium text-neutral-800">Delete this item?</p>
            <p className="text-sm text-neutral-500">
              This action cannot be undone.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default App;
