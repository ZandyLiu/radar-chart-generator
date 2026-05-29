export default function SiteLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0">
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer circle */}
          <circle cx="18" cy="18" r="16" stroke="#3B82F6" strokeWidth="2.5" fill="white" />
          {/* Middle circle */}
          <circle cx="18" cy="18" r="11" stroke="#3B82F6" strokeWidth="2" fill="white" />
          {/* Inner circle */}
          <circle cx="18" cy="18" r="6" stroke="#3B82F6" strokeWidth="1.5" fill="#3B82F6" fillOpacity="0.15" />
          {/* Center dot */}
          <circle cx="18" cy="18" r="2.5" fill="#EF4444" />
          {/* Crosshair lines */}
          <line x1="18" y1="2" x2="18" y2="34" stroke="#E5E7EB" strokeWidth="1" />
          <line x1="2" y1="18" x2="34" y2="18" stroke="#E5E7EB" strokeWidth="1" />
          {/* Diagonal lines */}
          <line x1="6.7" y1="6.7" x2="29.3" y2="29.3" stroke="#E5E7EB" strokeWidth="1" />
          <line x1="29.3" y1="6.7" x2="6.7" y2="29.3" stroke="#E5E7EB" strokeWidth="1" />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold text-gray-800">雷达图生成器</h1>
        <p className="text-xs text-gray-400">通用多维雷达图快速生成工具</p>
      </div>
    </div>
  );
}
