import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Music, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in | FutureKeys Music Academy" },
      { name: "description", content: "Sign in or create an account on FutureKeys." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type AuthMode = "signin" | "signup" | "forgot" | "reset";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    if (isRecovery) { setMode("reset"); return; }

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setMode("reset");
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/studio" });
    });
    return () => listener?.subscription.unsubscribe();
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth",
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Check your email for the reset link.");
      return;
    }

    if (mode === "reset") {
      if (password.length < 6) { setLoading(false); return toast.error("Password must be at least 6 characters."); }
      const { error } = await supabase.auth.updateUser({ password });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Password updated. Signing in…");
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) navigate({ to: "/studio" });
      });
      return;
    }

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { emailRedirectTo: window.location.origin + "/studio", data: { full_name: fullName } },
      });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Account created. You can now sign in.");
      setMode("signin");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      navigate({ to: "/studio" });
    }
  }

  async function onGoogle() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/studio" });
    if (r.error) toast.error("Could not start Google sign-in");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-md p-8 shadow-premium">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-gold shadow-gold">
            <Music className="h-7 w-7 text-navy" strokeWidth={2.5} />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-navy">
            {mode === "signin" && "Welcome back"}
            {mode === "signup" && "Create your account"}
            {mode === "forgot" && "Reset your password"}
            {mode === "reset" && "Set new password"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">FutureKeys Music Academy</p>
        </div>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          {(mode === "signin" || mode === "signup") && (
            <>
              {mode === "signup" && (
                <div><Label>Full name</Label><Input className="mt-1.5" value={fullName} onChange={(e)=>setFullName(e.target.value)} required /></div>
              )}
              <div><Label>Email</Label><Input className="mt-1.5" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required /></div>
              <div>
                <Label>Password</Label>
                <Input className="mt-1.5" type="password" minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} required />
                {mode === "signin" && (
                  <button type="button" onClick={() => setMode("forgot")} className="mt-1.5 text-xs text-gold hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <Button type="submit" variant="navy" size="lg" disabled={loading} className="w-full">
                {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Sign up"}
              </Button>
            </>
          )}

          {mode === "forgot" && (
            <>
              <p className="text-sm text-muted-foreground">Enter your email and we'll send you a link to reset your password.</p>
              <div><Label>Email</Label><Input className="mt-1.5" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required /></div>
              <Button type="submit" variant="navy" size="lg" disabled={loading} className="w-full">
                {loading ? "Sending..." : "Send reset link"}
              </Button>
              <button type="button" onClick={() => setMode("signin")} className="flex items-center gap-1 mx-auto text-xs text-gold hover:underline">
                <ArrowLeft className="h-3 w-3" /> Back to sign in
              </button>
            </>
          )}

          {mode === "reset" && (
            <>
              <p className="text-sm text-muted-foreground">Enter your new password.</p>
              <div><Label>New password</Label><Input className="mt-1.5" type="password" minLength={6} value={password} onChange={(e)=>setPassword(e.target.value)} required /></div>
              <Button type="submit" variant="navy" size="lg" disabled={loading} className="w-full">
                {loading ? "Updating..." : "Update password"}
              </Button>
            </>
          )}
        </form>

        {mode !== "forgot" && mode !== "reset" && (
          <>
            <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" />
            </div>
            <Button onClick={onGoogle} variant="outline" size="lg" className="w-full">
              Continue with Google
            </Button>
          </>
        )}

        {mode !== "forgot" && mode !== "reset" && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-gold font-medium hover:underline">
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>
        )}
      </Card>
    </div>
  );
}
