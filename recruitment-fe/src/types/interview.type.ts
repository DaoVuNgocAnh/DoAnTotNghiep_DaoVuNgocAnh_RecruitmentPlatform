export const InterviewStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  DECLINED: 'DECLINED',
} as const;

export type InterviewStatus =
  (typeof InterviewStatus)[keyof typeof InterviewStatus];

export interface Interview {
  id: string;
  applicationId: string;
  interviewDate: string;
  location: string;
  status: InterviewStatus;
  responseDate?: string;
  employer?: {
    id: string;
    fullName: string;
    email: string;
  };
  application: {
    candidate?: {
      fullName: string;
      email: string;
      phone: string;
    };
    job: {
      title: string;
      company?: {
        name: string;
        logoUrl: string;
      }
    };
  };
}

export interface CreateInterviewDto {
  applicationId: string;
  interviewDate: string;
  location: string;
}
