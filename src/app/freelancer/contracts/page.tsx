'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'react-feather';
import { useContract } from "@/context/ContractContext";
import { useAuth } from "@/context/AuthContext";
import jsPDF from "jspdf";

type Contract = import("@/context/ContractContext").Contract;

export default function FreelancerContractsPage() {
  const router = useRouter();
  const { contracts, signContract } = useContract();
  const { user } = useAuth();
  const [selected, setSelected] = useState<Contract | null>(null);
  const [signing, setSigning] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Si no hay usuario autenticado, no mostrar nada (o redirigir si lo prefieres)
  if (!user) {
    return <div className="text-gray-500">Debes iniciar sesión para ver tus contratos.</div>;
  }

  // Filtrar contratos del freelancer logueado
  const myContracts = contracts.filter((c: any) => c.freelancerId === user.id);

  const handleSign = async (contract: any) => {
    setSigning(true);
    try {
      const result = await signContract(contract.id, user.id, user.name, 'freelancer');
      if (result.success) {
        setSuccess('¡Contrato firmado exitosamente!');
        setSelected({
          ...contract,
          signatures: [
            ...contract.signatures.map((s: any) => ({ ...s, name: s.userName || s.name })),
            { userId: user.id, userName: user.name, name: user.name, role: 'freelancer', signedAt: new Date().toISOString(), ipAddress: '', signature: '' }
          ]
        });
      } else {
        setSuccess(result.message);
      }
    } catch (e) {
      setSuccess('Error al firmar el contrato');
    }
    setSigning(false);
  };

  const handleDownloadPDF = (contract: any) => {
    if (!contract) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(contract.title, 10, 15);
    doc.setFontSize(12);
    doc.text(`Freelancer: ${contract.freelancerName}`, 10, 30);
    doc.text(`Cliente: ${contract.clientName}`, 10, 40);
    doc.text(`Valor: $${contract.value.toLocaleString()} ${contract.currency}`, 10, 50);
    doc.text(`Inicio: ${new Date(contract.startDate).toLocaleDateString()}`, 10, 60);
    doc.text(`Fin: ${new Date(contract.endDate).toLocaleDateString()}`, 10, 70);
    doc.text(`Estado: ${contract.status}`, 10, 80);
    doc.text("Términos:", 10, 90);
    doc.text(contract.terms || "", 10, 100, { maxWidth: 180 });
    doc.save(`Contrato_${contract.title.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Mis Contratos</h1>
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded flex items-center gap-2">
          <CheckCircle size={18} /> {success}
          <button className="ml-auto text-green-700" onClick={() => setSuccess(null)}><XCircle size={18} /></button>
        </div>
      )}
      {myContracts.length === 0 ? (
        <div className="text-gray-500">No tienes contratos asignados aún.</div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contrato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Firmas</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {myContracts.map(contract => (
                <tr key={contract.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{contract.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{contract.clientName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">${contract.value} {contract.currency}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      contract.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      contract.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {contract.status === 'active' ? 'Activo' : contract.status === 'pending' ? 'Pendiente' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{contract.signatures.length}/2</span>
                      {contract.signatures.length > 0 && (
                        <div className="flex -space-x-2">
                          {contract.signatures.map((sig: any, idx: number) => (
                            <div
                              key={idx}
                              className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium text-white"
                              title={`${sig.userName || sig.name} (${sig.role})`}
                            >
                              {(sig.userName || sig.name || '').charAt(0).toUpperCase()}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300 mr-2"
                      onClick={() => router.push(`/freelancer/contracts/${contract.id}`)}
                    >
                      Ver
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      onClick={() => handleDownloadPDF(contract)}
                    >
                      Descargar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 