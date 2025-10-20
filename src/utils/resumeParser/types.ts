// 简历解析相关类型定义

export interface ParsedResumeData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  country?: string;
  city?: string;
  jobTitles?: string[];
  skills?: string[];
  education?: EducationEntry[];
  employmentHistory?: EmploymentEntry[];
  summary?: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

export interface EmploymentEntry {
  company: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  achievements?: string[];
}

export interface FileConversionResult {
  file: File;
  originalType: string;
  convertedType: string;
}

export interface PDFParseResult {
  text: string;
  pages: number;
  info?: any;
}

export interface ResumeParseError {
  message: string;
  code: string;
  details?: any;
}

// 支持的文件类型
export type SupportedFileType = 'pdf' | 'docx' | 'doc' | 'txt' | 'pages';

// 文件转换类型
export type ConversionType = 'doc-to-docx' | 'pages-to-pdf';

// 解析器状态
export enum ParserStatus {
  IDLE = 'idle',
  PARSING = 'parsing',
  SUCCESS = 'success',
  ERROR = 'error'
}

// 解析器配置
export interface ParserConfig {
  enableFallback: boolean;
  maxRetries: number;
  timeout: number;
  enableFileConversion: boolean;
} 