// 专有名词白名单
const PROPER_NOUNS = [
  'AWS', 'Azure', 'GCP', 'Google Cloud', 'Microsoft 365', 'Office 365', 'SAP', 'ERP', 'CRM', 'HR', 'HRIS', 'HRMS', 'API', 'REST', 'GraphQL', 'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Oracle', 'DB2', 'DynamoDB', 'S3', 'EC2', 'Lambda', 'Docker', 'Kubernetes', 'K8s', 'Jenkins', 'Git', 'GitHub', 'GitLab', 'Bitbucket', 'CI/CD', 'DevOps', 'Agile', 'Scrum', 'Kanban', 'Jira', 'Confluence', 'Figma', 'Sketch', 'Photoshop', 'Illustrator', 'XD', 'HTML', 'CSS', 'SCSS', 'SASS', 'LESS', 'JavaScript', 'TypeScript', 'Node.js', 'React', 'React Native', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Express', 'Flask', 'Django', 'Spring', '.NET', 'C#', 'C++', 'C', 'Java', 'Python', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Objective-C', 'R', 'MATLAB', 'VBA', 'PowerShell', 'Bash', 'Shell', 'Linux', 'Unix', 'Windows', 'macOS', 'iOS', 'Android', 'Flutter', 'Firebase', 'Tableau', 'Power BI', 'Looker', 'Snowflake', 'Salesforce', 'HubSpot', 'Shopify', 'WordPress', 'WooCommerce', 'Magento', 'BigCommerce',
  // 新增常见缩写和专有名词
  'UI', 'UX', 'AI', 'PR', 'ML', 'DL', 'NLP', 'CV', 'SaaS', 'PaaS', 'IaaS', 'API', 'SDK', 'IDE', 'CDN', 'SEO', 'SEM', 'BI', 'ETL', 'NoSQL', 'RPA', 'IoT', 'AR', 'VR', 'MR', 'XR', 'OCR', 'JWT', 'JWTs', 'JWT Token', 'JWT Tokens', 'JWT Auth', 'JWT Authentication', 'JWT Authorization', 'JWT Bearer', 'JWT Secret', 'JWT Key', 'JWT Keys', 'JWT Algorithm', 'JWT Algorithms', 'JWT Header', 'JWT Headers', 'JWT Payload', 'JWT Payloads', 'JWT Claim', 'JWT Claims', 'JWT Exp', 'JWT Expires', 'JWT Expiry', 'JWT Expiration', 'JWT Issuer', 'JWT Audience', 'JWT Subject', 'JWT Not Before', 'JWT Issued At', 'JWT JWT', 'JWT JWTs', 'JWT JWT Token', 'JWT JWT Tokens', 'JWT JWT Auth', 'JWT JWT Authentication', 'JWT JWT Authorization', 'JWT JWT Bearer', 'JWT JWT Secret', 'JWT JWT Key', 'JWT JWT Keys', 'JWT JWT Algorithm', 'JWT JWT Algorithms', 'JWT JWT Header', 'JWT JWT Headers', 'JWT JWT Payload', 'JWT JWT Payloads', 'JWT JWT Claim', 'JWT JWT Claims', 'JWT JWT Exp', 'JWT JWT Expires', 'JWT JWT Expiry', 'JWT JWT Expiration', 'JWT JWT Issuer', 'JWT JWT Audience', 'JWT JWT Subject', 'JWT JWT Not Before', 'JWT JWT Issued At', 'JWT JWT JWT', 'JWT JWT JWTs', 'JWT JWT JWT Token', 'JWT JWT JWT Tokens', 'JWT JWT JWT Auth', 'JWT JWT JWT Authentication', 'JWT JWT JWT Authorization', 'JWT JWT JWT Bearer', 'JWT JWT JWT Secret', 'JWT JWT JWT Key', 'JWT JWT JWT Keys', 'JWT JWT JWT Algorithm', 'JWT JWT JWT Algorithms', 'JWT JWT JWT Header', 'JWT JWT JWT Headers', 'JWT JWT JWT Payload', 'JWT JWT JWT Payloads', 'JWT JWT JWT Claim', 'JWT JWT JWT Claims', 'JWT JWT JWT Exp', 'JWT JWT JWT Expires', 'JWT JWT JWT Expiry', 'JWT JWT JWT Expiration', 'JWT JWT JWT Issuer', 'JWT JWT JWT Audience', 'JWT JWT JWT Subject', 'JWT JWT JWT Not Before', 'JWT JWT JWT Issued At',
  // 用户新增专有名词
  'SDLC', 'COE', 'AB testing', 'NDIS',
  // 财务相关专有名词
  'CPA', 'CFA', 'CA', 'ACCA', 'CIMA', 'CMA', 'CGA', 'CIA', 'CISA', 'CISSP', 'PMP', 'PRINCE2', 'ITIL', 'Six Sigma', 'Lean', 'Agile', 'Scrum', 'Kanban', 'SAFe', 'TOGAF', 'COBIT', 'ISO 27001', 'ISO 9001', 'GDPR', 'SOX', 'IFRS', 'GAAP', 'ASIC', 'APRA', 'ATO', 'ASX', 'ASIC', 'FASB', 'IASB', 'XBRL', 'ERP', 'SAP', 'Oracle', 'QuickBooks', 'Xero', 'MYOB', 'Reckon', 'Intuit', 'BlackLine', 'Workiva', 'NetSuite', 'Salesforce', 'HubSpot', 'Tableau', 'Power BI', 'Qlik', 'Alteryx', 'KNIME', 'R', 'Python', 'SQL', 'VBA', 'Excel', 'Access', 'Word', 'PowerPoint', 'Outlook', 'Teams', 'SharePoint', 'OneDrive', 'Office 365', 'Microsoft 365', 'Google Workspace', 'G Suite', 'Slack', 'Zoom', 'Webex', 'Teams', 'Skype', 'Trello', 'Asana', 'Monday.com', 'Notion', 'Airtable', 'Smartsheet', 'Jira', 'Confluence', 'Bitbucket', 'GitHub', 'GitLab', 'Azure DevOps', 'Jenkins', 'Bamboo', 'CircleCI', 'Travis CI', 'GitLab CI', 'GitHub Actions', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Google Cloud', 'IBM Cloud', 'Oracle Cloud', 'Salesforce Cloud', 'SAP Cloud', 'Workday', 'SuccessFactors', 'BambooHR', 'ADP', 'Paychex', 'Gusto', 'Rippling', 'Justworks', 'TriNet', 'Insperity', 'Paylocity', 'Paycom', 'Paycor', 'Namely', 'Zenefits', 'Gusto', 'Rippling', 'Justworks', 'TriNet', 'Insperity', 'Paylocity', 'Paycom', 'Paycor', 'Namely', 'Zenefits'
];

/**
 * 格式化 Tag，使用专有名词白名单和标准化逻辑
 */
export function formatTag(tag: string): string {
  if (!tag) return '';
  
  // 精确匹配白名单（区分大小写）
  if (PROPER_NOUNS.includes(tag.trim())) return tag.trim();
  
  // 不区分大小写匹配，返回白名单标准写法
  const found = PROPER_NOUNS.find(pn => pn.toLowerCase() === tag.trim().toLowerCase());
  if (found) return found;
  
  // 其余保持原有格式（如Full Time等）
  const words = tag.split(' ');
  return [words[0].charAt(0).toUpperCase() + words[0].slice(1).toLowerCase(), ...words.slice(1).map(w => w.toLowerCase())].join(' ');
}

/**
 * 过滤函数：只保留3词以内且不包含软性描述的Tag
 */
export function filterKeyRequirements(rawTags: string[]): string[] {
  return rawTags.filter(tag =>
    tag.trim().split(/\s+/).length <= 3 &&
    !/deliver|excellent|ability to|passion|customer service|strong/i.test(tag)
  );
}
