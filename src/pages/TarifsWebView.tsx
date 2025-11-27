import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TarifsWebView = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header avec bouton retour */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-4 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="hover:bg-primary/10"
        >
          <ArrowLeft className="w-5 h-5 text-primary" />
        </Button>
        <h1 className="text-lg font-semibold text-foreground">Tarifs</h1>
      </div>

      {/* WebView iframe */}
      <iframe
        src="https://amzingfba.com/tarifs"
        className="flex-1 w-full border-0 mt-[73px]"
        title="Tarifs AMZing FBA"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
};

export default TarifsWebView;
