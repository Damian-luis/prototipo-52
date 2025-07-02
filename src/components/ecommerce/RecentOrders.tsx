"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { useMockData } from "@/context/MockDataContext";

// Define the TypeScript interface for the table rows
interface Contrato {
  id: number;
  freelancer: string;
  empresa: string;
  monto: string;
  estado: "Pagado" | "Pendiente" | "Cancelado";
}

// Define the table data using the interface
const tableData: Contrato[] = [
  { id: 1, freelancer: "Juan Pérez", empresa: "Globant", monto: "$1,200", estado: "Pagado" },
  { id: 2, freelancer: "Ana López", empresa: "MercadoLibre", monto: "$900", estado: "Pendiente" },
  { id: 3, freelancer: "Carlos Ruiz", empresa: "Telefónica", monto: "$1,500", estado: "Pagado" },
  { id: 4, freelancer: "María Gómez", empresa: "Despegar", monto: "$1,100", estado: "Cancelado" },
  { id: 5, freelancer: "Pedro Sánchez", empresa: "BBVA", monto: "$2,000", estado: "Pagado" },
];

export default function RecentOrders() {
  const { recentContracts } = useMockData();

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Últimas contrataciones y pagos
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Filtrar
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200">
            Ver todos
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          {/* Table Header */}
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Freelancer
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Empresa
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Monto
              </TableCell>
              <TableCell
                isHeader
                className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                Estado
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {recentContracts.map((contrato) => (
              <TableRow key={contrato.id} className="">
                <TableCell className="py-3">
                  <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {contrato.freelancer}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {contrato.empresa}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  {contrato.monto}
                </TableCell>
                <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      contrato.estado === "Pagado"
                        ? "success"
                        : contrato.estado === "Pendiente"
                        ? "warning"
                        : "error"
                    }
                  >
                    {contrato.estado}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
