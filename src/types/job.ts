export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  salary?: string;
  requirements?: string[];
  benefits?: string[];
  jobType?: string;
  employmentType?: string;
  workMode?: string;
  experience?: string;
  postedDate?: string;
  platform: string;
  url: string;
  tags?: string[];
  skills?: string[];
  openToRelocate?: boolean;
  matchScore?: number;
  subScores?: {
    experience: number;
    industry: number;
    skills: number;
    other: number;
  };
  matchAnalysis?: string;
  matchHighlights?: string[];
  summary?: string;
  detailedSummary?: string;
  keyRequirements?: string[];
} 