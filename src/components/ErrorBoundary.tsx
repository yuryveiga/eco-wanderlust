import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Home, AlertCircle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-8 p-10 bg-card rounded-[2.5rem] border shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-destructive/10 rounded-3xl flex items-center justify-center mx-auto ring-8 ring-destructive/5">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            
            <div className="space-y-3">
              <h1 className="font-serif text-3xl font-black text-foreground">Oops! Algo deu errado.</h1>
              <p className="text-muted-foreground font-sans leading-relaxed">
                Sentimos muito, mas ocorreu um erro inesperado. Nossa equipe já foi notificada.
              </p>
            </div>

            {this.state.error && (
               <div className="p-4 bg-muted/50 rounded-2xl text-[10px] font-mono text-left overflow-auto max-h-32 opacity-70">
                  {this.state.error.toString()}
               </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <Button 
                onClick={() => window.location.reload()} 
                className="rounded-xl h-12 gap-2 font-bold"
              >
                <RefreshCcw className="w-4 h-4" />
                Tentar Novamente
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className="rounded-xl h-12 gap-2 font-bold"
              >
                <Home className="w-4 h-4" />
                Ir para Início
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.children;
  }
}
