import type { Metadata } from "next";
import React from "react";
import Badge from "@/components/ui/badge/Badge";
import { ArrowUpIcon, GroupIcon, BoxIconLine, PieChartIcon } from "@/icons";
import MonthlyTarget from "@/components/ecommerce/MonthlyTarget";
import MonthlySalesChart from "@/components/ecommerce/MonthlySalesChart";
import StatisticsChart from "@/components/ecommerce/StatisticsChart";
import DemographicCard from "@/components/ecommerce/DemographicCard";
import RecentOrders from "@/components/ecommerce/RecentOrders";

export const metadata: Metadata = {
  title: "Dashboard | FreelaSaaS",
  description: "Panel principal para la gestión de freelancers, contrataciones y pagos.",
};

export default function Dashboard() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Métricas principales */}
      <div className="col-span-12 space-y-6 xl:col-span-7">
        {/* Objetivo mensual de contrataciones */}
        <MonthlyTarget />
        {/* Gráfico de contrataciones mensuales */}
        <MonthlySalesChart />
      </div>
      {/* Estadísticas y demografía */}
      <div className="col-span-12 xl:col-span-5 flex flex-col gap-6">
        <StatisticsChart />
        <DemographicCard />
      </div>
      {/* Últimas contrataciones/pagos */}
      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div>
      {/* Métricas rápidas */}
      <div className="col-span-12 xl:col-span-5 grid grid-cols-2 gap-4">
        {/* Contrataciones activas */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Contrataciones activas</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">37</h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              12.5%
            </Badge>
          </div>
        </div>
        {/* Freelancers registrados */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <BoxIconLine className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Freelancers registrados</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">1,245</h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              6.8%
            </Badge>
          </div>
        </div>
        {/* Pagos procesados este mes */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <PieChartIcon className="text-gray-800 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Pagos procesados (junio)</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">$18,900</h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              9.1%
            </Badge>
          </div>
        </div>
        {/* Empresas activas */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
            <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
          </div>
          <div className="flex items-end justify-between mt-5">
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Empresas activas</span>
              <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">62</h4>
            </div>
            <Badge color="success">
              <ArrowUpIcon />
              3.2%
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
