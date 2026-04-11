import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      toast({ title: "Erro", description: error, variant: "destructive" });
    } else {
      if (isSignUp) {
        toast({ title: "Conta criada!", description: "Faça login agora." });
        setIsSignUp(false);
      } else {
        navigate("/admin");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-lg border border-border/50 p-8">
        <div className="text-center mb-8">
          <img 
            src="https://ogzasprtfgimjqrtcseg.supabase.co/storage/v1/object/public/site-images//images__1_-removebg-preview.png" 
            alt="Tocorime Rio" 
            className="w-20 h-20 mx-auto mb-4 object-contain"
          />
          <h1 className="font-serif text-2xl font-bold text-foreground">Painel Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-sans">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="font-sans">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              minLength={4}
            />
          </div>
          <Button type="submit" className="w-full font-sans" disabled={isLoading}>
            {isLoading ? "Carregando..." : isSignUp ? "Criar Conta" : "Entrar"}
          </Button>
        </form>

      </div>
    </div>
  );
};

export default AdminLogin;
