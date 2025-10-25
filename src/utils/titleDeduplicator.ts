/**
 * 去重job title中的重复内容
 * 处理后端传输时可能产生的title重复问题
 */
export function deduplicateJobTitle(title: string): string {
  if (!title || typeof title !== 'string') return title;
  
  // 去除首尾空格
  const trimmedTitle = title.trim();
  if (!trimmedTitle) return title;
  
  // 检测完全重复的模式，如 "Financial AnalystFinancial Analyst"
  const halfLength = Math.ceil(trimmedTitle.length / 2);
  const firstHalf = trimmedTitle.substring(0, halfLength);
  const secondHalf = trimmedTitle.substring(halfLength);
  
  // 如果前半部分和后半部分相同，返回前半部分
  if (firstHalf === secondHalf) {
    return firstHalf;
  }
  
  // 检测其他重复模式
  // 例如：查找重复的短语
  const words = trimmedTitle.split(' ');
  const uniqueWords: string[] = [];
  
  for (let i = 0; i < words.length; i++) {
    if (i === 0 || words[i] !== words[i - 1]) {
      uniqueWords.push(words[i]);
    }
  }
  
  const deduplicatedTitle = uniqueWords.join(' ');
  
  // 如果去重后的结果与原始结果相同，说明没有重复，返回原始title
  if (deduplicatedTitle === trimmedTitle) {
    return title; // 返回原始title（保持原始格式）
  }
  
  return deduplicatedTitle;
} 