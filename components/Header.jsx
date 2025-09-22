import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header style={{display:"flex",gap:"12px",padding:"10px 16px",borderBottom:"1px solid #eee",alignItems:"center"}}>
      <Link href="/">Riskpuls</Link>
      <nav style={{marginLeft:"auto",display:"flex",gap:"8px"}}>
        <Link href="/risks">Risks</Link>
        {status === "loading" ? null : session ? (
          <button onClick={() => signOut()} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6}}>
            Sign out
          </button>
        ) : (
          <button onClick={() => signIn("github")} style={{padding:"6px 10px",border:"1px solid #ddd",borderRadius:6}}>
            Sign in with GitHub
          </button>
        )}
      </nav>
    </header>
  );
}
