export interface ApplicationActor {
  id: string;
  fullName: string;
  email: string;
}

export interface ApplicationHistory {
  id: string;
  oldStatus?: string | null;
  newStatus: string;
  note?: string | null;
  createdAt: string;
  actor: ApplicationActor;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  resumeId: string;
  applyDate: string;
  status: 'PENDING' | 'INTERVIEW' | 'REJECTED' | 'ACCEPTED' | 'WITHDRAWN' | 'REVIEWING';
  employerNote?: string;
  candidateNote?: string;
  job: {
    title: string;
    company: {
      name: string;
      logoUrl?: string;
    };
  };
  resume: {
    resumeName: string;
    fileUrl: string;
  };
  candidate?: {
    fullName: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
  };
}
