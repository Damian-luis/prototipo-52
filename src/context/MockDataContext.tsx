"use client";
import React, { createContext, useContext } from "react";

// Objeto único con toda la data mockeada
const mockData = {
  metrics: {
    freelancersActivos: 3782,
    empresasContratando: 5359,
    contratacionesActivas: 37,
    freelancersRegistrados: 1245,
    pagosProcesadosMes: 18900,
    empresasActivas: 62,
    crecimientoContrataciones: 12.5,
    crecimientoFreelancers: 6.8,
    crecimientoPagos: 9.1,
    crecimientoEmpresas: 3.2,
  },
  monthlyTarget: {
    porcentaje: 78.2,
    valor: "$20K",
    tendencia: "+8%",
    descripcion: "Has alcanzado el 78% de tu meta de contrataciones este mes. ¡Sigue así!",
    metaMensual: "$20K",
    pagosProcesados: "$20K",
    contratacionesHoy: "$20K",
  },
  monthlyHires: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
  statistics: {
    exito: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235],
    satisfaccion: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140],
  },
  freelancersByCountry: [
    { country: "Estados unidos", value: 120, percent: 79 },
    { country: "Francia", value: 95, percent: 23 },
    { country: "España", value: 80, percent: 18 },
    { country: "Colombia", value: 60, percent: 12 },
    { country: "Chile", value: 45, percent: 9 },
  ],
  recentContracts: [
    { id: 1, freelancer: "Juan Pérez", empresa: "Globant", monto: "$1,200", estado: "Pagado" },
    { id: 2, freelancer: "Ana López", empresa: "MercadoLibre", monto: "$900", estado: "Pendiente" },
    { id: 3, freelancer: "Carlos Ruiz", empresa: "Telefónica", monto: "$1,500", estado: "Pagado" },
    { id: 4, freelancer: "María Gómez", empresa: "Despegar", monto: "$1,100", estado: "Cancelado" },
    { id: 5, freelancer: "Pedro Sánchez", empresa: "BBVA", monto: "$2,000", estado: "Pagado" },
  ],
  reports: [
    { id: 1, tipo: "Desempeño", fecha: "2024-06-01", estado: "Generado" },
    { id: 2, tipo: "Costos", fecha: "2024-05-28", estado: "Generado" },
    { id: 3, tipo: "Contratos", fecha: "2024-05-20", estado: "Pendiente" },
  ],
};

const MockDataContext = createContext<typeof mockData>(mockData);

export const MockDataProvider = ({ children }: { children: React.ReactNode }) => (
  <MockDataContext.Provider value={mockData}>{children}</MockDataContext.Provider>
);

export const useMockData = () => useContext(MockDataContext); 