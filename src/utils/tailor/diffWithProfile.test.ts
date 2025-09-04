import { diffWithProfile, getJobRequirements } from './diffWithProfile';
import { PersonalInfo } from '@/types/profile';
import { Job } from '@/types/job';

// 模拟用户 Profile 数据
const mockUserProfile: PersonalInfo = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneCode: '+61',
  country: 'Australia',
  city: 'Sydney',
  jobTitle: 'Software Engineer',
  seniority: 'Mid-level',
  jobType: 'Full-time',
  skills: [
    { name: 'JavaScript' },
    { name: 'React' },
    { name: 'Node.js' },
    { name: 'Python' }
  ],
  employment: [
    {
      startDate: '2020-01',
      endDate: '2023-01',
      company: 'Tech Corp',
      position: 'Frontend Developer',
      description: 'Developed React applications and managed frontend architecture'
    }
  ],
  education: [
    {
      startDate: '2016-01',
      endDate: '2020-01',
      degree: 'Bachelor of Computer Science',
      school: 'University of Sydney',
      field: 'Computer Science'
    }
  ],
  about: 'Experienced software engineer with expertise in modern web technologies'
};

// 模拟 Job 数据
const mockJob: Job = {
  id: '1',
  title: 'Senior Software Engineer',
  company: 'Tech Company',
  location: 'Sydney',
  platform: 'LinkedIn',
  url: 'https://example.com',
  keyRequirements: ['JavaScript', 'React', 'Python', 'AWS'],
  requirements: ['5+ years experience', 'Team leadership'],
  skills: ['Node.js', 'Docker', 'Kubernetes'],
  description: 'We are looking for a senior developer...',
  detailedSummary: 'Requirements: JavaScript, React, Python, AWS'
};

describe('diffWithProfile', () => {
  test('should return empty arrays when job has no requirements', () => {
    const emptyJob: Job = {
      id: '1',
      title: 'Test Job',
      company: 'Test Company',
      location: 'Sydney',
      platform: 'LinkedIn',
      url: 'https://example.com'
    };
    const result = diffWithProfile(emptyJob, mockUserProfile);
    expect(result.met).toEqual([]);
    expect(result.missing).toEqual([]);
  });

  test('should return all requirements as missing when no profile provided', () => {
    const result = diffWithProfile(mockJob, null as any);
    expect(result.met).toEqual([]);
    expect(result.missing).toEqual(['JavaScript', 'React', 'Python', 'AWS', '5+ years experience', 'Team leadership', 'Node.js', 'Docker', 'Kubernetes']);
  });

  test('should prioritize keyRequirements over other fields', () => {
    const jobWithKeyRequirements: Job = {
      ...mockJob,
      keyRequirements: ['JavaScript', 'React'],
      requirements: ['Java', 'Spring'],
      skills: ['Python', 'Django']
    };
    const result = diffWithProfile(jobWithKeyRequirements, mockUserProfile);
    
    // 应该只比对 keyRequirements
    expect(result.met).toContain('JavaScript');
    expect(result.met).toContain('React');
    expect(result.missing).toEqual([]);
  });

  test('should fallback to requirements when no keyRequirements', () => {
    const jobWithoutKeyRequirements: Job = {
      ...mockJob,
      keyRequirements: [],
      requirements: ['Java', 'Spring', 'Team leadership']
    };
    const result = diffWithProfile(jobWithoutKeyRequirements, mockUserProfile);
    
    expect(result.met).toContain('Team leadership');
    expect(result.missing).toContain('Java');
    expect(result.missing).toContain('Spring');
  });

  test('should fallback to skills when no keyRequirements or requirements', () => {
    const jobWithOnlySkills: Job = {
      ...mockJob,
      keyRequirements: [],
      requirements: [],
      skills: ['Node.js', 'Docker', 'Kubernetes']
    };
    const result = diffWithProfile(jobWithOnlySkills, mockUserProfile);
    
    expect(result.met).toContain('Node.js');
    expect(result.missing).toContain('Docker');
    expect(result.missing).toContain('Kubernetes');
  });

  test('should correctly identify met requirements from skills', () => {
    const result = diffWithProfile(mockJob, mockUserProfile);
    
    expect(result.met).toContain('JavaScript');
    expect(result.met).toContain('React');
    expect(result.met).toContain('Python');
    expect(result.missing).toContain('AWS');
  });

  test('should handle case-insensitive matching', () => {
    const jobWithMixedCase: Job = {
      ...mockJob,
      keyRequirements: ['javascript', 'REACT', 'python']
    };
    const result = diffWithProfile(jobWithMixedCase, mockUserProfile);
    
    expect(result.met).toContain('javascript');
    expect(result.met).toContain('REACT');
    expect(result.met).toContain('python');
  });

  test('should extract keywords from employment descriptions', () => {
    const jobWithDescriptionRequirements: Job = {
      ...mockJob,
      keyRequirements: ['React', 'architecture', 'frontend']
    };
    const result = diffWithProfile(jobWithDescriptionRequirements, mockUserProfile);
    
    expect(result.met).toContain('React');
    expect(result.met).toContain('architecture');
    expect(result.met).toContain('frontend');
  });

  test('should extract keywords from education', () => {
    const jobWithEducationRequirements: Job = {
      ...mockJob,
      keyRequirements: ['Computer Science', 'University']
    };
    const result = diffWithProfile(jobWithEducationRequirements, mockUserProfile);
    
    expect(result.met).toContain('Computer Science');
    expect(result.met).toContain('University');
  });

  test('should extract keywords from about section', () => {
    const jobWithAboutRequirements: Job = {
      ...mockJob,
      keyRequirements: ['software', 'engineer', 'web', 'technologies']
    };
    const result = diffWithProfile(jobWithAboutRequirements, mockUserProfile);
    
    expect(result.met).toContain('software');
    expect(result.met).toContain('engineer');
    expect(result.met).toContain('web');
    expect(result.met).toContain('technologies');
  });
});

describe('getJobRequirements', () => {
  test('should prioritize keyRequirements', () => {
    const requirements = getJobRequirements(mockJob);
    expect(requirements).toEqual(['JavaScript', 'React', 'Python', 'AWS']);
  });

  test('should fallback to requirements when no keyRequirements', () => {
    const jobWithoutKeyRequirements: Job = {
      ...mockJob,
      keyRequirements: []
    };
    const requirements = getJobRequirements(jobWithoutKeyRequirements);
    expect(requirements).toEqual(['5+ years experience', 'Team leadership']);
  });

  test('should fallback to skills when no keyRequirements or requirements', () => {
    const jobWithOnlySkills: Job = {
      ...mockJob,
      keyRequirements: [],
      requirements: []
    };
    const requirements = getJobRequirements(jobWithOnlySkills);
    expect(requirements).toEqual(['Node.js', 'Docker', 'Kubernetes']);
  });

  test('should return empty array when no requirements available', () => {
    const emptyJob: Job = {
      id: '1',
      title: 'Test Job',
      company: 'Test Company',
      location: 'Sydney',
      platform: 'LinkedIn',
      url: 'https://example.com'
    };
    const requirements = getJobRequirements(emptyJob);
    expect(requirements).toEqual([]);
  });
});
