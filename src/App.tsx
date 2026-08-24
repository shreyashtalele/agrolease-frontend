import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import { useUIStore } from "@/store/uiStore";
import { ToastContainer } from "@/components/common/Toast";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

function App() {
  const { toasts, removeToast } = useUIStore();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppRouter />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
