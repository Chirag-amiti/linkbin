export const languageOptions = [
  { value: 'text', label: 'Plain text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'jsx', label: 'React JSX' },
  { value: 'json', label: 'JSON' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'bash', label: 'Bash' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'sql', label: 'SQL' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'log', label: 'Log' },
];

const syntaxLanguageMap = {
  cplusplus: 'cpp',
  'c++': 'cpp',
  cs: 'csharp',
  csharp: 'csharp',
  js: 'javascript',
  ts: 'typescript',
  shell: 'bash',
  sh: 'bash',
  ps: 'powershell',
  ps1: 'powershell',
  md: 'markdown',
  text: 'text',
  plaintext: 'text',
  log: 'text',
};

export const normalizeSyntaxLanguage = (language = 'text') => {
  const normalized = language.toLowerCase().trim();
  return syntaxLanguageMap[normalized] || normalized || 'text';
};

export const getLanguageLabel = (language = 'text') => {
  const normalized = normalizeSyntaxLanguage(language);
  return languageOptions.find((option) => option.value === normalized)?.label || language;
};
