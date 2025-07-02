"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa6";

const ProfileSection = ({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit?: () => void }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow mb-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
      {onEdit && (
        <button onClick={onEdit} className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <span>Editar</span>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
        </button>
      )}
    </div>
    {children}
  </div>
);

const EditModal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-lg w-full p-8 relative">
        <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
};

const FreelancerProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [editPersonal, setEditPersonal] = useState(false);
  const [editAddress, setEditAddress] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    hourlyRate: user?.hourlyRate || 0,
    skills: user?.skills?.join(", ") || "",
    country: user?.address || "",
    city: user?.city || "",
    postalCode: user?.postalCode || "",
    taxId: user?.taxId || "",
  });
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSavePersonal = async () => {
    setLoading(true);
    await updateProfile({
      name: form.name,
      email: form.email,
      phone: form.phone,
      bio: form.bio,
      hourlyRate: Number(form.hourlyRate),
      skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
    });
    setEditPersonal(false);
    setLoading(false);
  };

  const handleSaveAddress = async () => {
    setLoading(true);
    await updateProfile({
      address: form.country,
      city: form.city,
      postalCode: form.postalCode,
      taxId: form.taxId,
    });
    setEditAddress(false);
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-2 md:px-8 py-8">
      {/* Perfil principal */}
      <div className="bg-white dark:bg-gray-900 rounded-xl p-6 md:p-10 shadow flex flex-col md:flex-row md:items-center md:gap-10 mb-8">
        <img src={user.profilePicture || "/images/user/user-02.jpg"} alt={user.name} className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 dark:border-gray-800 mb-4 md:mb-0" />
        <div className="flex-1">
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</div>
          <div className="text-gray-500 dark:text-gray-400 mb-1">{user.role === "freelancer" ? "Freelancer" : user.role}</div>
          <div className="text-gray-500 dark:text-gray-400 mb-1">{user.email}</div>
          <div className="text-gray-500 dark:text-gray-400 mb-2">{user.address || "Ubicación no especificada"}</div>
          <div className="flex gap-3 mt-2">
            <a href="#" className="text-gray-400 hover:text-blue-600"><FaFacebookF /></a>
            <a href="#" className="text-gray-400 hover:text-blue-600"><FaXTwitter /></a>
            <a href="#" className="text-gray-400 hover:text-blue-600"><FaLinkedinIn /></a>
            <a href="#" className="text-gray-400 hover:text-blue-600"><FaInstagram /></a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Información Personal */}
        <ProfileSection title="Información Personal" onEdit={() => setEditPersonal(true)}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">Nombre</div>
              <div className="font-semibold text-gray-800 dark:text-white">{user.name}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Email</div>
              <div className="font-semibold text-gray-800 dark:text-white">{user.email}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Teléfono</div>
              <div className="font-semibold text-gray-800 dark:text-white">{user.phone || <span className="text-gray-400">No especificado</span>}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Bio</div>
              <div className="font-semibold text-gray-800 dark:text-white">{user.bio || <span className="text-gray-400">No especificada</span>}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Tarifa por hora (USD)</div>
              <div className="font-semibold text-gray-800 dark:text-white">${user.hourlyRate || 0} USD</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Habilidades</div>
              <div className="font-semibold text-gray-800 dark:text-white">{user.skills?.join(", ") || <span className="text-gray-400">No especificadas</span>}</div>
            </div>
          </div>
        </ProfileSection>
        {/* Dirección */}
        <ProfileSection title="Dirección" onEdit={() => setEditAddress(true)}>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <div className="text-xs text-gray-500 mb-1">País</div>
              <div className="font-semibold text-gray-800 dark:text-white">{user.address || <span className="text-gray-400">No especificado</span>}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Ciudad/Estado</div>
              <div className="font-semibold text-gray-800 dark:text-white">{user.city || <span className="text-gray-400">No especificado</span>}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Código Postal</div>
              <div className="font-semibold text-gray-800 dark:text-white">{user.postalCode || <span className="text-gray-400">No especificado</span>}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">TAX ID</div>
              <div className="font-semibold text-gray-800 dark:text-white">{user.taxId || <span className="text-gray-400">No especificado</span>}</div>
            </div>
          </div>
        </ProfileSection>
      </div>

      {/* Modal edición personal */}
      <EditModal open={editPersonal} onClose={() => setEditPersonal(false)}>
        <h2 className="text-xl font-bold mb-4">Editar Información Personal</h2>
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
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={() => setEditPersonal(false)} className="px-4 py-2 bg-gray-100 rounded">Cancelar</button>
          <button onClick={handleSavePersonal} disabled={loading} className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50">{loading ? "Guardando..." : "Guardar"}</button>
        </div>
      </EditModal>
      {/* Modal edición dirección */}
      <EditModal open={editAddress} onClose={() => setEditAddress(false)}>
        <h2 className="text-xl font-bold mb-4">Editar Dirección</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">País</label>
            <input name="country" value={form.country} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ciudad/Estado</label>
            <input name="city" value={form.city} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Código Postal</label>
            <input name="postalCode" value={form.postalCode} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">TAX ID</label>
            <input name="taxId" value={form.taxId} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-6">
          <button onClick={() => setEditAddress(false)} className="px-4 py-2 bg-gray-100 rounded">Cancelar</button>
          <button onClick={handleSaveAddress} disabled={loading} className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50">{loading ? "Guardando..." : "Guardar"}</button>
        </div>
      </EditModal>
    </div>
  );
};

export default FreelancerProfilePage; 