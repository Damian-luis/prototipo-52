"use client";
import React, { useState, useEffect } from 'react';
import { jobsService } from '@/services/jobs.service';
import { contractsService } from '@/services/contracts.service';
import { paymentsService } from '@/services/payments.service';
import { useAuth } from '@/context/AuthContext';

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

export default function StatisticsChart() {
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
    datasets: [
      {
        label: 'Proyectos',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: ['rgba(59, 130, 246, 0.5)'],
        borderColor: ['rgba(59, 130, 246, 1)'],
        borderWidth: 1,
      },
      {
        label: 'Contratos',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: ['rgba(16, 185, 129, 0.5)'],
        borderColor: ['rgba(16, 185, 129, 1)'],
        borderWidth: 1,
      },
      {
        label: 'Pagos',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: ['rgba(245, 158, 11, 0.5)'],
        borderColor: ['rgba(245, 158, 11, 1)'],
        borderWidth: 1,
      },
    ],
  });

  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) return;

      try {
        // Obtener datos reales del backend
        const [jobs, contracts, payments] = await Promise.all([
          jobsService.getAllJobs(),
          contractsService.getAllContracts(),
          paymentsService.getAllPayments(),
        ]);

        // Procesar datos para el gráfico (simplificado por ahora)
        const monthlyData = {
          projects: [12, 19, 3, 5, 2, 3],
          contracts: [8, 15, 7, 12, 9, 11],
          payments: [25, 30, 18, 22, 28, 35],
        };

        setChartData(prev => ({
          ...prev,
          datasets: [
            {
              ...prev.datasets[0],
              data: monthlyData.projects,
            },
            {
              ...prev.datasets[1],
              data: monthlyData.contracts,
            },
            {
              ...prev.datasets[2],
              data: monthlyData.payments,
            },
          ],
        }));
      } catch (error) {
        console.error('Error loading statistics:', error);
      }
    };

    loadData();
  }, [user?.id]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Estadísticas Mensuales
      </h3>
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Gráfico de estadísticas (implementación pendiente)
        </p>
      </div>
    </div>
  );
}
