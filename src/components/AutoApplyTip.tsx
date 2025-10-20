import { useEffect, useState } from 'react';

export default function AutoApplyTip() {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setOpacity(0), 14500); // 14.5秒后开始淡出
    const hideTimer = setTimeout(() => setVisible(false), 15000); // 15秒后隐藏
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <span
      className="ml-3 inline-block bg-yellow-50 text-yellow-800 text-xs px-2 py-0.5 rounded shadow border border-yellow-300 z-10 transition-opacity duration-500 align-middle"
      style={{ opacity }}
    >
      <strong>New!</strong> <strong>Tailor Resume+</strong> — Tailor your resume & cover letter to the JD — and ensure ATS-friendly formatting.
    </span>
  );
} 