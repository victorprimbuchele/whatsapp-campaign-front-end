import { Loader2 } from "lucide-react";

export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span>Carregando...</span>
    </div>
  );
};
