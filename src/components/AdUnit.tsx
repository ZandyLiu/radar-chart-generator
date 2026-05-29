export default function AdUnit({ variant = 'banner' }: { variant?: 'banner' | 'sidebar' }) {
  const height = variant === 'banner' ? 'h-20' : 'h-64';
  return (
    <div className={`${height} bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center`}>
      <div className="text-center">
        <div className="text-gray-300 text-xs mb-1">Advertisement</div>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </div>
  );
}
