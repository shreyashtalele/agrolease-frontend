import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Card } from "@/components/common/Card";
import { Badge } from "@/components/common/Badge";
import { ToastContainer } from "@/components/common/Toast";
import { Modal } from "@/components/common/Modal";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useToast } from "@/hooks/useToast";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error, info, warning, toasts, removeToast } = useToast();

  const handleLoading = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      success("Loading complete!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-primary-500 text-center mb-8">
          🌾 AgroLease - Component Library
        </h1>

        {/* LoadingSpinner Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold text-neutral-800">
              LoadingSpinner Component
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner size="sm" />
                <span className="text-xs text-neutral-500">Small</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner size="md" />
                <span className="text-xs text-neutral-500">Medium</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <LoadingSpinner size="lg" />
                <span className="text-xs text-neutral-500">Large</span>
              </div>
              <Button onClick={handleLoading} loading={isLoading}>
                {isLoading ? "Loading..." : "Simulate Loading"}
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Toast Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold text-neutral-800">
              Toast Notifications
            </h3>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => success("Success! Operation completed.")}>
                Success
              </Button>
              <Button
                variant="danger"
                onClick={() => error("Error! Something went wrong.")}
              >
                Error
              </Button>
              <Button
                variant="outline"
                onClick={() => info("Info: New update available.")}
              >
                Info
              </Button>
              <Button
                variant="secondary"
                onClick={() => warning("Warning: Please check your input.")}
              >
                Warning
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Modal Section */}
        <Card className="mb-6">
          <Card.Header>
            <h3 className="text-lg font-semibold text-neutral-800">Modal</h3>
          </Card.Header>
          <Card.Body>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
              <Button
                variant="danger"
                onClick={() => setIsConfirmModalOpen(true)}
              >
                Confirm Modal
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
            <Badge variant="success">✅ Toast</Badge>
            <Badge variant="success">✅ LoadingSpinner</Badge>
          </div>
          <p className="text-xs text-neutral-400 mt-3">
            Phase 2 Complete! 🎉 All core components built.
          </p>
        </div>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

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
              Save
            </Button>
          </>
        }
      >
        <p className="text-neutral-600">This is a sample modal with content.</p>
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
