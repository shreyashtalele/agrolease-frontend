import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes";
import { useUIStore } from "@/store/uiStore";
import { ToastContainer } from "@/components/common/Toast";

function App() {
  const { toasts, removeToast } = useUIStore();

  return (
    <BrowserRouter>
      <AppRouter />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </BrowserRouter>
  );
}

export default App;
