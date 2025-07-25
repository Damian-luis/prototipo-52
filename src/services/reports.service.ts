import api from '@/util/axios';

export interface ReportMetrics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalApplications: number;
  pendingApplications: number;
  acceptedApplications: number;
  totalContracts: number;
  activeContracts: number;
  completedContracts: number;
  totalEarnings: number;
  totalSpent: number;
  averageRating: number;
  totalProfessionals: number;
  activeProfessionals: number;
  monthlyStats: {
    month: string;
    projects: number;
    applications: number;
    contracts: number;
    earnings: number;
  }[];
  topSkills: {
    skill: string;
    count: number;
  }[];
  projectStatusDistribution: {
    status: string;
    count: number;
    percentage: number;
  }[];
  applicationStatusDistribution: {
    status: string;
    count: number;
    percentage: number;
  }[];
}

export interface CompanyReportMetrics extends ReportMetrics {
  totalJobs: number;
  activeJobs: number;
  closedJobs: number;
  totalApplicants: number;
  averageApplicationsPerJob: number;
  topPerformingJobs: {
    jobId: string;
    title: string;
    applications: number;
    views: number;
  }[];
}

export interface ProfessionalReportMetrics extends ReportMetrics {
  totalAppliedJobs: number;
  acceptedJobs: number;
  rejectedJobs: number;
  successRate: number;
  averageResponseTime: number;
  topCompanies: {
    companyId: string;
    companyName: string;
    projects: number;
    earnings: number;
  }[];
}

export const reportsService = {
  // Get company reports
  async getCompanyReports(dateRange?: { startDate: string; endDate: string }): Promise<CompanyReportMetrics> {
    const params = dateRange ? `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}` : '';
    const response = await api.get(`/reports/company${params}`);
    return response.data;
  },

  // Get professional reports
  async getProfessionalReports(dateRange?: { startDate: string; endDate: string }): Promise<ProfessionalReportMetrics> {
    const params = dateRange ? `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}` : '';
    const response = await api.get(`/reports/professional${params}`);
    return response.data;
  },

  // Get general reports
  async getGeneralReports(dateRange?: { startDate: string; endDate: string }): Promise<ReportMetrics> {
    const params = dateRange ? `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}` : '';
    const response = await api.get(`/reports/general${params}`);
    return response.data;
  },

  // Get reports by date range
  async getReportsByDateRange(startDate: string, endDate: string): Promise<ReportMetrics> {
    const response = await api.get(`/reports/range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  // Export reports
  async exportReport(type: 'pdf' | 'excel', dateRange?: { startDate: string; endDate: string }): Promise<Blob> {
    const params = dateRange ? `?type=${type}&startDate=${dateRange.startDate}&endDate=${dateRange.endDate}` : `?type=${type}`;
    const response = await api.get(`/reports/export${params}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}; 