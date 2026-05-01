import React from 'react';
import { Button } from './ui/button';
import { AlertCircle } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    console.error('Stack:', error.stack);
    console.error('Component stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const isInvalidCharError = this.state.error?.message?.includes("Invalid character");
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <div className="max-w-md w-full space-y-4 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
            <p className="text-muted-foreground">
              {this.state.error?.message || "Une erreur inattendue s'est produite"}
            </p>
            {isInvalidCharError && (
              <p className="text-sm text-muted-foreground">
                Cela peut être dû à un cache ancien. Essayez de vider le cache du navigateur.
              </p>
            )}
            <details className="text-left text-xs text-muted-foreground bg-muted p-3 rounded">
              <summary className="cursor-pointer font-medium">Détails techniques</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words">
                {this.state.error?.stack || this.state.error?.message}
              </pre>
            </details>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
                variant="default"
              >
                Réessayer
              </Button>
              <Button
                onClick={async () => {
                  try {
                    if ('caches' in window) {
                      const keys = await caches.keys();
                      await Promise.all(keys.map((k) => caches.delete(k)));
                    }
                    if ('serviceWorker' in navigator) {
                      const regs = await navigator.serviceWorker.getRegistrations();
                      await Promise.all(regs.map((r) => r.unregister()));
                    }
                  } catch (e) {
                    console.error('Cache clear failed', e);
                  }
                  window.location.reload();
                }}
                variant="outline"
              >
                Vider cache
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
