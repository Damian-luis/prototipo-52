'use client'
import React, { useState } from "react";
//import { Metadata } from "next";

/*export const metadata: Metadata = {
  title: "Next.js Profile | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Profile page for TailAdmin - Next.js Tailwind CSS Admin Dashboard Template",
};*/

export default function ProfilePage() {
  const [name, setName] = useState("María González");
  const [email, setEmail] = useState("maria@empresa.com");
  const [preferences, setPreferences] = useState("Notificaciones por email");

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-gray-900 rounded-xl p-8 shadow">
      <h1 className="text-2xl font-bold mb-6">Perfil de Usuario</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input className="w-full border rounded p-2" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="w-full border rounded p-2" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Preferencias</label>
          <input className="w-full border rounded p-2" value={preferences} onChange={e => setPreferences(e.target.value)} />
        </div>
        <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar Cambios</button>
      </form>
    </div>
  );
}
