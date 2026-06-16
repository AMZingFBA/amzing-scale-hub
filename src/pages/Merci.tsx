import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle2, Loader2 } from "lucide-react";

const SAFE_INTERNAL_PATHS = ["/dashboard", "/android-payment", "/tarifs", "/"];

const Merci = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const firedRef = useRef(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    document.title = "Inscription confirmée – AMZing FBA";
    let robots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    const prev = robots.content;
    robots.content = "noindex, nofollow";

    // Fire Google Ads conversion ONCE on this confirmation page only
    if (!firedRef.current) {
      firedRef.current = true;
      try {
        const w = window as any;
        if (typeof w.gtag === "function") {
          w.gtag("event", "conversion", {
            send_to: "AW-18223379828/O6fDCKiJr8AcEPTqvvFD",
          });
        }
      } catch (e) {
        console.error("[Merci] gtag conversion error", e);
      }
    }

    // Determine next destination (passed via router state or sessionStorage)
    const stateNext = (location.state as { next?: string } | null)?.next;
    const stored = sessionStorage.getItem("post_signup_redirect");
    const next = stateNext || stored || null;
    if (stored) sessionStorage.removeItem("post_signup_redirect");
    setRedirectUrl(next);
  }, [location.state]);

  useEffect(() => {
    if (!redirectUrl) return;
    if (countdown <= 0) {
      if (redirectUrl.startsWith("http")) {
        window.location.href = redirectUrl;
      } else {
        navigate(redirectUrl, { replace: true });
      }
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, redirectUrl, navigate]);

  const goNow = () => {
    if (!redirectUrl) return;
    if (redirectUrl.startsWith("http")) {
      window.location.href = redirectUrl;
    } else {
      navigate(redirectUrl, { replace: true });
    }
  };

  return (
    <>
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Inscription validée 🎉</h1>
          <p className="text-muted-foreground mb-6">
            Merci ! Votre compte AMZing FBA a bien été créé.
          </p>

          {redirectUrl ? (
            <>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Redirection dans {countdown}s…</span>
              </div>
              <button
                onClick={goNow}
                className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition"
              >
                Continuer maintenant
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/dashboard", { replace: true })}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-lg hover:opacity-90 transition"
            >
              Accéder à mon espace
            </button>
          )}
        </div>
      </main>
    </>
  );
};

export default Merci;
