import { useEffect, useState } from 'react';

interface ResumeUploadTipProps {
  language?: 'en' | 'zh';
}

export default function ResumeUploadTip({ language = 'en' }: ResumeUploadTipProps) {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setOpacity(0), 7500); // 先淡出 (7.5秒)
    const hideTimer = setTimeout(() => setVisible(false), 8000); // 再隐藏 (8秒)
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  const text = language === 'zh'
    ? 'Héra 会自动从您的简历构建个人资料。'
    : 'Héra auto-builds your profile after resume upload.';

  return (
    <div
      className="absolute -top-8 left-0 bg-yellow-50 text-yellow-800 text-sm px-3 py-1 rounded shadow-md border border-yellow-300 z-10 transition-opacity duration-500"
      style={{ opacity }}
    >
      <strong>{text}</strong>
    </div>
  );
} 