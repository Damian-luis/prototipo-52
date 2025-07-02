"use client";
import React, { useState, useMemo } from "react";
import { useTalent } from "@/context/TalentContext";
import { useAuth } from "@/context/AuthContext";
import ComponentCard from "@/components/common/ComponentCard";
import Input from "@/components/form/input/InputField";
import Link from "next/link";

const JobSearchPage = () => {
  const { vacancies, applyToJob, applications } = useTalent();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [salaryFilter, setSalaryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);

  // Filtrar vacantes abiertas
  const openVacancies = vacancies.filter(v => v.status === 'open');

  // Aplicar filtros
  const filteredVacancies = useMemo(() => {
    return openVacancies.filter(vacancy => {
      // Búsqueda por texto
      const matchesSearch = 
        vacancy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vacancy.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

      // Filtro por tipo
      const matchesType = typeFilter === "all" || vacancy.type === typeFilter;

      // Filtro por ubicación
      const matchesLocation = locationFilter === "all" || vacancy.location === locationFilter;

      // Filtro por salario
      let matchesSalary = true;
      if (salaryFilter !== "all") {
        const [min, max] = salaryFilter.split("-").map(Number);
        matchesSalary = vacancy.salaryRange.min >= min && vacancy.salaryRange.min <= (max || Infinity);
      }

      return matchesSearch && matchesType && matchesLocation && matchesSalary;
    });
  }, [openVacancies, searchTerm, typeFilter, locationFilter, salaryFilter]);

  // Verificar si el usuario ya aplicó a una vacante
  const hasApplied = (jobId: string) => {
    return applications.some(app => app.jobId === jobId && app.freelancerId === user?.id);
  };

  const handleApply = async (jobId: string, jobTitle: string) => {
    if (!user) return;

    setApplying(jobId);
    try {
      const result = await applyToJob({
        jobId,
        freelancerId: user.id,
        freelancerName: user.name,
        freelancerEmail: user.email,
        coverLetter: `Estoy muy interesado en la posición de ${jobTitle}. Creo que mis habilidades y experiencia son perfectas para este rol.`
      });

      if (result.success) {
        alert("¡Aplicación enviada exitosamente!");
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error al enviar la aplicación");
    } finally {
      setApplying(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Buscar Trabajos
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Encuentra oportunidades que se ajusten a tus habilidades
        </p>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Buscar por título, descripción o habilidades..."
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            ⚙️ Filtros
          </button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tipo de trabajo
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="all">Todos</option>
                <option value="full-time">Tiempo completo</option>
                <option value="part-time">Medio tiempo</option>
                <option value="contract">Contrato</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ubicación
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="all">Todas</option>
                <option value="Remoto">Remoto</option>
                <option value="Presencial">Presencial</option>
                <option value="Híbrido">Híbrido</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Rango salarial (USD)
              </label>
              <select
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-gray-300 px-4 py-2.5 text-sm shadow-theme-xs focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              >
                <option value="all">Todos</option>
                <option value="0-2000">$0 - $2,000</option>
                <option value="2000-5000">$2,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-">$10,000+</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Resultados */}
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {filteredVacancies.length} trabajos encontrados
        </p>

        {filteredVacancies.map((vacancy) => (
          <ComponentCard key={vacancy.id} title={vacancy.title}>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400">
                {vacancy.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📍</span>
                  <span>{vacancy.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">💼</span>
                  <span>{vacancy.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">💰</span>
                  <span>
                    ${vacancy.salaryRange.min} - ${vacancy.salaryRange.max} {vacancy.salaryRange.currency}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📅</span>
                  <span>{vacancy.experienceRequired} años de experiencia</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Habilidades requeridas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {vacancy.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs bg-brand-100 text-brand-700 dark:bg-brand-900/20 dark:text-brand-400 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500">
                  {vacancy.applicationsCount} aplicaciones
                </span>
                <div className="flex gap-2">
                  <Link
                    href={`/freelancer/jobs/${vacancy.id}`}
                    className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Ver detalles
                  </Link>
                  {hasApplied(vacancy.id) ? (
                    <span className="px-4 py-2 text-sm bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 rounded-lg">
                      Ya aplicaste
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApply(vacancy.id, vacancy.title)}
                      disabled={applying === vacancy.id}
                      className="px-4 py-2 text-sm bg-brand-500 text-white rounded-lg hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {applying === vacancy.id ? "Aplicando..." : "Aplicar ahora"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </ComponentCard>
        ))}

        {filteredVacancies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No se encontraron trabajos que coincidan con tu búsqueda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSearchPage; 