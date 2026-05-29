import { useState } from 'react';
import { encodeState } from '../utils/shareUrl';
import type { Snapshot } from '../types';

interface Props {
  exportState: () => Snapshot;
}

export default function EmbedCode({ exportState }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const state = exportState();
    const hash = encodeState(state);
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const embedUrl = `${baseUrl}?embed=1#${hash}`;
    const code = `<iframe src="${embedUrl}" width="600" height="600" frameborder="0" style="max-width:100%" loading="lazy"></iframe>`;

    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.createElement('textarea');
      input.value = code;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm text-gray-600 block">嵌入代码</label>
      <p className="text-xs text-gray-400">
        生成 iframe 代码，粘贴到你的网站中即可嵌入当前雷达图。
      </p>
      <button
        onClick={handleCopy}
        className="w-full py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
      >
        {copied ? '已复制!' : '复制嵌入代码'}
      </button>
    </div>
  );
}
