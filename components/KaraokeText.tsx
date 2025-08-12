import { useEffect, useMemo, useRef } from 'react';

interface KaraokeTextProps {
  text: string;
  highlightIndex: number; // char index
  highlightLength: number; // number of chars to highlight
  isActive: boolean;
  isApproximate?: boolean;
  scrollAlign?: 'top' | 'center' | 'bottom';
  scrollMarginPx?: number;
}

export const KaraokeText: React.FC<KaraokeTextProps> = ({
  text,
  highlightIndex,
  highlightLength,
  isActive,
  isApproximate = false,
  scrollAlign = 'center',
  scrollMarginPx = 12,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const before = useMemo(() => text.slice(0, Math.max(0, highlightIndex)), [text, highlightIndex]);
  const current = useMemo(
    () => text.slice(Math.max(0, highlightIndex), Math.max(0, highlightIndex + Math.max(0, highlightLength))),
    [text, highlightIndex, highlightLength]
  );
  const after = useMemo(() => text.slice(Math.max(0, highlightIndex + Math.max(0, highlightLength))), [text, highlightIndex, highlightLength]);

  useEffect(() => {
    // Автопрокрутка к подсветке
    const container = containerRef.current;
    if (!container) return;
    const mark = container.querySelector('[data-karaoke-current]') as HTMLElement | null;
    if (mark) {
      const markTop = mark.offsetTop;
      const markBottom = markTop + mark.offsetHeight;
      const viewTop = container.scrollTop;
      const viewBottom = viewTop + container.clientHeight;
      const needsScroll = markTop < viewTop + scrollMarginPx || markBottom > viewBottom - scrollMarginPx;
      if (needsScroll) {
        const alignRatio = scrollAlign === 'top' ? 0.1 : scrollAlign === 'bottom' ? 0.85 : 0.5;
        const targetTop = Math.max(0, Math.floor(markTop - container.clientHeight * alignRatio));
        container.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    }
  }, [highlightIndex, highlightLength]);

  if (!text.trim()) {
    return null;
  }

  return (
    <div className="mt-4 bg-dark-card border border-gray-600 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-dark-text font-semibold">Караоке подсветка</h3>
        {isActive && (
          <span className="text-xs px-2 py-0.5 rounded bg-gray-700 text-gray-300">
            {isApproximate ? 'приблизительно' : 'точно'}
          </span>
        )}
      </div>
      <div
        ref={containerRef}
        className="max-h-48 overflow-auto whitespace-pre-wrap leading-relaxed text-dark-text text-sm"
      >
        <span>{before}</span>
        <mark
          data-karaoke-current
          className={`px-0.5 rounded ${isActive ? 'bg-yellow-500/30 text-yellow-200' : 'bg-gray-600/30'}`}
        >
          {current || (isActive ? ' ' : '')}
        </mark>
        <span>{after}</span>
      </div>
    </div>
  );
};


