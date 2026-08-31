import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/common/Button";
import { useNavigation } from "@/hooks/useNavigation";

interface BackButtonProps {
  label?: string;
  fallbackPath?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = "Back",
  fallbackPath = "/dashboard",
}) => {
  const { goBack } = useNavigation();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={goBack}
      className="flex items-center gap-1 text-neutral-600 hover:text-primary-600"
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </Button>
  );
};
