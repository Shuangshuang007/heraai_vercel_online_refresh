import { Job } from '@/types/job';

interface PlatformResult {
  platform: string;
  jobs: Job[];
  total: number;
  page: number;
  totalPages: number;
}

// Platform search URL builder function
export function buildSearchUrl(platform: string, jobTitle: string, skills: string[], city: string): string {
  const encodedTitle = encodeURIComponent(jobTitle);
  const encodedCity = encodeURIComponent(city);
  const encodedSkills = encodeURIComponent(skills.join(' '));

  switch (platform.toLowerCase()) {
    case 'linkedin':
      return `https://www.linkedin.com/jobs/search/?keywords=${encodedTitle}%20${encodedSkills}&location=${encodedCity}`;
    case 'seek':
      return `https://www.seek.com.au/${encodedTitle}-jobs/in-${encodedCity}`;
    case 'jora':
      return `https://au.jora.com/jobs?q=${encodedTitle}%20${encodedSkills}&l=${encodedCity}`;
    case 'efinancialcareers':
      return `https://www.efinancialcareers.com/jobs-${encodedCity}-${encodedTitle}`;
    case 'indeed':
      return `https://au.indeed.com/jobs?q=${encodedTitle}%20${encodedSkills}&l=${encodedCity}`;
    case 'Boss Direct':
      return `https://www.zhipin.com/job_detail/?query=${encodedTitle}&city=${encodedCity}`;
    case 'Zhaopin':
      return `https://sou.zhaopin.com/?jl=${encodedCity}&kw=${encodedTitle}`;
    case '51job':
      return `https://search.51job.com/list/${encodedCity},000000,0000,00,9,99,${encodedTitle},2,1.html`;
    case 'Liepin':
      return `https://www.liepin.com/zhaopin/?key=${encodedTitle}&dqs=${encodedCity}`;
    default:
      return '';
  }
}

// Get recommended platforms
function getRecommendedPlatforms(jobTitle: string, city: string): string[] {
  const defaultPlatforms = ['LinkedIn', 'Seek', 'Indeed'];
  // Add platform recommendation logic based on job title
  return defaultPlatforms;
}

// Generate search URL
function generateSearchUrls(jobTitle: string, skills: string[], city: string): Array<{platform: string, url: string}> {
  const platforms = getRecommendedPlatforms(jobTitle, city);
  return platforms.map(platform => ({
    platform,
    url: buildSearchUrl(platform, jobTitle, skills, city)
  }));
}

// Batch apply for jobs
export async function handleBatchLinkedInApply(jobs: Job[]) {
  try {
    // Store applied job IDs
    const appliedJobs = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
    
    // Open URL for each selected job
    jobs.forEach(job => {
      if (job.url) {
        window.open(job.url, '_blank');
        // Add to applied jobs list
        if (!appliedJobs.includes(job.id)) {
          appliedJobs.push(job.id);
        }
      }
    });
    
    // Update applied jobs list
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
  } catch (error) {
    console.error('Error applying to jobs:', error);
  }
} 