"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";

const FreelancerProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    hourlyRate: user?.hourlyRate || 0,
    skills: user?.skills?.join(", ") || "",
  });
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    await updateProfile({
      name: form.name,
      email: form.email,
      phone: form.phone,
      bio: form.bio,
      hourlyRate: Number(form.hourlyRate),
      skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
    });
    setEditMode(false);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      <ComponentCard title="Información Personal">
        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input name="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teléfono</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea name="bio" value={form.bio} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tarifa por hora (USD)</label>
              <input name="hourlyRate" type="number" value={form.hourlyRate} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Habilidades (separadas por coma)</label>
              <input name="skills" value={form.skills} onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditMode(false)} className="px-4 py-2 bg-gray-100 rounded">Cancelar</button>
              <button onClick={handleSave} disabled={loading} className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50">{loading ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div><span className="font-medium">Nombre:</span> {user.name}</div>
            <div><span className="font-medium">Email:</span> {user.email}</div>
            <div><span className="font-medium">Teléfono:</span> {user.phone || <span className="text-gray-400">No especificado</span>}</div>
            <div><span className="font-medium">Bio:</span> {user.bio || <span className="text-gray-400">No especificado</span>}</div>
            <div><span className="font-medium">Tarifa por hora:</span> ${user.hourlyRate || 0} USD</div>
            <div><span className="font-medium">Habilidades:</span> {user.skills?.join(", ") || <span className="text-gray-400">No especificadas</span>}</div>
            <button onClick={() => setEditMode(true)} className="mt-4 px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600">Editar Perfil</button>
          </div>
        )}
      </ComponentCard>
    </div>
  );
};

export default FreelancerProfilePage; 