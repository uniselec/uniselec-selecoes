// StagingGateClientOnly.tsx
import { useEffect, useState } from "react";

function b64(s: string){ return Uint8Array.from(atob(s), c=>c.charCodeAt(0)); }
function toB64(u8: Uint8Array){ return btoa(String.fromCharCode(...u8)); }

async function derive(pass: string, saltB64: string){
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: b64(saltB64), iterations: 120000, hash: "SHA-256" },
    key,
    256
  );
  return new Uint8Array(bits);
}

function constantTimeEq(a: Uint8Array, b: Uint8Array){
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i=0; i<a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export default function StagingGateClientOnly({ children }: { children: React.ReactNode }) {
  const enabled = import.meta.env.VITE_STAGING_ENABLED === "true";
  const SALT = import.meta.env.VITE_STAGING_SALT as string;
  const HASH = import.meta.env.VITE_STAGING_HASH as string;

  const [ok, setOk] = useState(false);
  const [tries, setTries] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) { setOk(true); return; }
    // “sessão” fraca em sessionStorage (fácil de burlar!)
    if (sessionStorage.getItem("staging_ok") === "1") setOk(true);
  }, [enabled]);

  if (!enabled) return <>{children}</>;
  if (ok) return <>{children}</>;

  async function submit(e: React.FormEvent){
    e.preventDefault();
    setError(null);
    const form = e.target as HTMLFormElement;
    const pass = (new FormData(form).get("pass") as string) || "";
    const derived = await derive(pass, SALT);
    const target = b64(HASH);
    const ok = constantTimeEq(derived, target);
    if (ok) {
      sessionStorage.setItem("staging_ok", "1"); // facilmente editável…
      window.location.reload();
    } else {
      setTries(t => t+1);
      setError("Senha incorreta");
    }
  }

  // rate limitzinho superficial
  if (tries >= 5) return <div style={{fontFamily:"system-ui", margin:"10vh auto", maxWidth:420}}>
    <h1>Homologação</h1><p>Bloqueado temporariamente. Recarregue a página.</p>
  </div>;

  return (
    <div style={{fontFamily:"system-ui", margin:"10vh auto", maxWidth:420}}>
      <h1>Homologação</h1>
      <p>Ambiente restrito (client-side only).</p>
      <form onSubmit={submit}>
        <input name="pass" type="password" placeholder="Senha" required style={{width:"100%", padding:12, margin:"12px 0"}} />
        <button style={{padding:12, width:"100%"}}>Entrar</button>
      </form>
      {error && <p style={{color:"crimson"}}>{error}</p>}
      <p style={{opacity:.7, marginTop:16}}><code>noindex, nofollow</code> recomendado.</p>
    </div>
  );
}
