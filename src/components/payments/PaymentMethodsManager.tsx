"use client";
import React, { useState } from "react";
import { FaEthereum, FaPaypal, FaTrash, FaPlus, FaRegStar, FaStar, FaUniversity, FaWallet } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";
import { SiBinance, SiPolygon } from "react-icons/si";
import { Listbox } from "@headlessui/react";

// Tipos de métodos de pago
const PAYMENT_TYPES = [
  { type: "wallet", label: "Wallet Cripto", icon: <FaWallet className="inline mr-1" /> },
  { type: "paypal", label: "PayPal", icon: <FaPaypal className="inline mr-1" /> },
];

// Mock inicial (solo wallet y paypal)
const MOCK_METHODS = [
  {
    id: "1",
    type: "wallet",
    label: "Wallet principal",
    address: "0x1234...abcd",
    network: "Ethereum",
    isDefault: true,
  },
  {
    id: "3",
    type: "paypal",
    email: "freelancer@email.com",
    isDefault: false,
  },
];

// Iconos de red para el modal
const NETWORK_ICONS: Record<string, React.ReactNode> = {
  Ethereum: <FaEthereum className="text-indigo-500 text-xl inline-block mr-2" />,
  "BNB Smart Chain": <SiBinance className="text-yellow-500 text-xl inline-block mr-2" />,
  Polygon: <SiPolygon className="text-purple-500 text-xl inline-block mr-2" />,
  Sepolia: <FaEthereum className="text-gray-400 text-xl inline-block mr-2" />,
};

const NETWORK_OPTIONS = [
  { value: "Ethereum", label: "Ethereum", icon: <FaEthereum className="text-indigo-500 text-xl mr-2" /> },
  { value: "BNB Smart Chain", label: "BNB Smart Chain", icon: <SiBinance className="text-yellow-500 text-xl mr-2" /> },
  { value: "Polygon", label: "Polygon", icon: <SiPolygon className="text-purple-500 text-xl mr-2" /> },
  { value: "Sepolia", label: "Sepolia", icon: <FaEthereum className="text-gray-400 text-xl mr-2" /> },
];

function getTypeIcon(type: string) {
  switch (type) {
    case "wallet": return <FaEthereum className="text-indigo-500" />;
    case "paypal": return <FaPaypal className="text-blue-500" />;
    default: return <FaWallet />;
  }
}

export default function PaymentMethodsManager() {
  const [methods, setMethods] = useState(MOCK_METHODS);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("wallet");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState<any>({});

  const handleAdd = () => {
    setForm({});
    setShowModal(true);
  };

  const handleSave = () => {
    const newMethod = {
      ...form,
      id: Date.now().toString(),
      isDefault: false,
      type: modalType,
    };
    setMethods((prev) => [...prev, newMethod]);
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  const handleCopy = (id: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1200);
  };

  // Renderiza el formulario según tipo
  const renderFormFields = () => {
    switch (modalType) {
      case "wallet":
        return (
          <>
            <label className="block mb-2 font-medium">Dirección Wallet</label>
            <input
              type="text"
              className="input input-bordered w-full mb-4"
              placeholder="0x..."
              value={form.address || ""}
              onChange={e => setForm({ ...form, address: e.target.value })}
            />
            <label className="block mb-2 font-medium">Red</label>
            <Listbox value={form.network || "Ethereum"} onChange={val => setForm({ ...form, network: val })}>
              {({ open }) => (
                <div className="relative">
                  <Listbox.Button className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-brand-500 flex items-center">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      {NETWORK_OPTIONS.find(opt => opt.value === (form.network || "Ethereum"))?.icon}
                    </span>
                    <span className="ml-7">
                      {NETWORK_OPTIONS.find(opt => opt.value === (form.network || "Ethereum"))?.label}
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {NETWORK_OPTIONS.map(option => (
                      <Listbox.Option
                        key={option.value}
                        value={option.value}
                        className={({ active }) =>
                          `cursor-pointer select-none relative px-4 py-2 flex items-center gap-2 ${active ? 'bg-brand-50 dark:bg-brand-900/20' : ''}`
                        }
                      >
                        <span className="mr-2">{option.icon}</span>
                        <span>{option.label}</span>
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              )}
            </Listbox>
            <label className="block mb-2 font-medium">Etiqueta</label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Wallet principal"
              value={form.label || ""}
              onChange={e => setForm({ ...form, label: e.target.value })}
            />
          </>
        );
      case "paypal":
        return (
          <>
            <label className="block mb-2 font-medium">Email de PayPal</label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="usuario@email.com"
              value={form.email || ""}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        {methods.length === 0 && (
          <div className="w-full text-center text-gray-500 dark:text-gray-400 py-8">No tienes métodos de pago registrados.</div>
        )}
        {methods.filter(m => m.type !== "bank").map((method) => (
          <div key={method.id} className="w-full md:w-[48%] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex flex-col gap-2 shadow-sm relative">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(method.type)}
              <span className="font-semibold text-lg">
                {method.type === "wallet" && (method.label || "Wallet")}
                {method.type === "paypal" && "PayPal"}
              </span>
              {method.isDefault ? (
                <FaStar className="text-yellow-400 ml-2" title="Principal" />
              ) : (
                <button onClick={() => handleSetDefault(method.id)} title="Marcar como principal">
                  <FaRegStar className="text-gray-400 ml-2 hover:text-yellow-400" />
                </button>
              )}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {method.type === "wallet" && (
                <div className="flex items-center gap-2">
                  <span className="font-mono">{method.address}</span>
                  <button onClick={() => handleCopy(method.id, method.address || "")} title="Copiar dirección">
                    <MdOutlineContentCopy className="w-4 h-4" />
                  </button>
                  {copiedId === method.id && <span className="text-green-600 ml-1 text-xs">¡Copiado!</span>}
                  <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs">{method.network}</span>
                </div>
              )}
              {method.type === "paypal" && (
                <div><b>Email:</b> {method.email}</div>
              )}
            </div>
            <button
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={() => handleDelete(method.id)}
              title="Eliminar"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {PAYMENT_TYPES.map((pt) => (
          <button
            key={pt.type}
            className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium transition-colors"
            onClick={() => { setModalType(pt.type); setShowModal(true); }}
          >
            {pt.icon}
            Agregar {pt.label}
          </button>
        ))}
      </div>
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-0 w-full max-w-md shadow-lg relative">
            <button className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setShowModal(false)}>
              ×
            </button>
            <div className="px-8 py-7">
              <h2 className="text-2xl font-bold mb-6 text-center">Agregar Wallet Cripto</h2>
              <form
                onSubmit={e => { e.preventDefault(); handleSave(); }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Dirección Wallet</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="0x..."
                    value={form.address || ""}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Red</label>
                  <Listbox value={form.network || "Ethereum"} onChange={val => setForm({ ...form, network: val })}>
                    {({ open }) => (
                      <div className="relative">
                        <Listbox.Button className="w-full pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-left focus:outline-none focus:ring-2 focus:ring-brand-500 flex items-center">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            {NETWORK_OPTIONS.find(opt => opt.value === (form.network || "Ethereum"))?.icon}
                          </span>
                          <span className="ml-7">
                            {NETWORK_OPTIONS.find(opt => opt.value === (form.network || "Ethereum"))?.label}
                          </span>
                        </Listbox.Button>
                        <Listbox.Options className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                          {NETWORK_OPTIONS.map(option => (
                            <Listbox.Option
                              key={option.value}
                              value={option.value}
                              className={({ active }) =>
                                `cursor-pointer select-none relative px-4 py-2 flex items-center gap-2 ${active ? 'bg-brand-50 dark:bg-brand-900/20' : ''}`
                              }
                            >
                              <span className="mr-2">{option.icon}</span>
                              <span>{option.label}</span>
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </div>
                    )}
                  </Listbox>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Etiqueta</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Wallet principal"
                    value={form.label || ""}
                    onChange={e => setForm({ ...form, label: e.target.value })}
                  />
                </div>
                <button type="submit" className="mt-4 w-full bg-brand-500 hover:bg-brand-600 text-white py-2 rounded-lg font-semibold text-lg shadow">Guardar</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
