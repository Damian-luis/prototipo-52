import Link from 'next/link';

export default function AdminLanding() {
  return (
    <div style={{ display: "flex", gap: "1rem", justifyContent: "center", margin: "2rem 0" }}>
      <Link href="/signin">
        <button style={{ padding: "1rem 2rem", background: "#2563eb", color: "#fff", borderRadius: "8px", border: "none", fontSize: "1rem" }}>
          Iniciar Sesión
        </button>
      </Link>
      <Link href="/signup">
        <button style={{ padding: "1rem 2rem", background: "#fff", color: "#2563eb", border: "2px solid #2563eb", borderRadius: "8px", fontSize: "1rem" }}>
          Registrarse
        </button>
      </Link>
      <Link href="/admin">
        <button style={{ padding: "1rem 2rem", background: "transparent", color: "#2563eb", border: "none", fontSize: "1rem" }}>
          Ver Dashboard
        </button>
      </Link>
    </div>
  );
} 