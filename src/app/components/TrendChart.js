'use client';
import React, { useState, useMemo } from 'react';

/* ═══════════════════════════════════════════════════════════════════════
   TrendChart — Premium Neon Financial Area Chart
   Bright colors · Gradient fills · Animated draw · Time-range pills
   ═══════════════════════════════════════════════════════════════════════ */

const TIME_RANGES = [
  { id: '1d', label: '1D', days: 1 },
  { id: '1w', label: '1W', days: 7 },
  { id: '1m', label: '1M', days: 30 },
  { id: '6m', label: '6M', days: 180 },
  { id: '1y', label: '1Y', days: 365 },
  { id: '2y', label: '2Y', days: 730 },
  { id: '3y', label: '3Y', days: 1095 },
  { id: '5y', label: '5Y', days: 1825 },
];

export default function TrendChart({ existingSaving = 0, transactions = [] }) {
  const [activeRange, setActiveRange] = useState('1w');
  const [hoverIdx, setHoverIdx] = useState(null);

  /* ── Filter transactions for the selected time range ── */
  const { points, changeAmt, changePct, isUp } = useMemo(() => {
    const now = new Date();
    const rangeObj = TIME_RANGES.find(r => r.id === activeRange);
    const cutoffDate = new Date(now.getTime() - rangeObj.days * 24 * 60 * 60 * 1000);

    // Transactions before the cutoff contribute to the opening balance
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

    let openingBal = Number(existingSaving);
    const afterCutoff = [];

    sorted.forEach(tx => {
      const txDate = new Date(tx.date);
      const amt = Number(tx.amount);
      if (txDate < cutoffDate) {
        openingBal += tx.type === 'income' ? amt : -amt;
      } else {
        afterCutoff.push(tx);
      }
    });

    // Build data points with running balance
    let bal = openingBal;
    const pts = [{ label: 'Opening', balance: bal, date: cutoffDate.toISOString().split('T')[0], type: null, amount: 0 }];

    afterCutoff.forEach(tx => {
      const amt = Number(tx.amount);
      bal += tx.type === 'income' ? amt : -amt;
      pts.push({
        label: tx.description,
        balance: bal,
        date: tx.date,
        type: tx.type,
        amount: amt,
        category: tx.category
      });
    });

    // If no transactions after cutoff, just show a flat line
    if (pts.length === 1) {
      const today = now.toISOString().split('T')[0];
      pts.push({ label: 'Current', balance: openingBal, date: today, type: null, amount: 0 });
    }

    // Downsample if too many points (max 40)
    const MAX_PTS = 40;
    let finalPts = pts;
    if (pts.length > MAX_PTS) {
      const bucketSize = Math.ceil(pts.length / MAX_PTS);
      finalPts = [pts[0]];
      for (let i = 1; i < pts.length; i += bucketSize) {
        const slice = pts.slice(i, i + bucketSize);
        const last = slice[slice.length - 1];
        finalPts.push(last);
      }
    }

    const firstBal = finalPts[0].balance;
    const lastBal = finalPts[finalPts.length - 1].balance;
    const change = lastBal - firstBal;
    const pct = firstBal !== 0 ? ((change / Math.abs(firstBal)) * 100) : 0;

    return {
      points: finalPts,
      changeAmt: change,
      changePct: pct,
      isUp: change >= 0
    };
  }, [activeRange, existingSaving, transactions]);

  /* ── Chart layout ── */
  const W = 560, H = 240;
  const PAD = { t: 28, r: 20, b: 38, l: 56 };
  const PW = W - PAD.l - PAD.r;
  const PH = H - PAD.t - PAD.b;

  /* ── Axis scaling ── */
  const balances = points.map(p => p.balance);
  const rawMax = Math.max(...balances);
  const rawMin = Math.min(...balances);
  const rawRange = rawMax - rawMin || 1000;
  const padding = rawRange * 0.1;
  const dataMax = rawMax + padding;
  const dataMin = rawMin - padding;
  const dataRange = dataMax - dataMin || 1000;

  const niceStep = (range) => {
    const rough = range / 3;
    const pow10 = Math.pow(10, Math.floor(Math.log10(rough)));
    const r = rough / pow10;
    const nice = r < 1.5 ? 1 : r < 3 ? 2 : r < 7.5 ? 5 : 10;
    return nice * pow10;
  };

  const step = niceStep(dataRange);
  const yMin = Math.floor(dataMin / step) * step;
  const yMax = Math.ceil(dataMax / step) * step;
  const yRange = yMax - yMin || 1000;

  /* ── Coordinate mappers ── */
  const gx = (i) => PAD.l + (i / Math.max(points.length - 1, 1)) * PW;
  const gy = (v) => PAD.t + (1 - (v - yMin) / yRange) * PH;
  const bottomY = H - PAD.b;

  /* ── Y-axis ticks ── */
  const ticks = [];
  for (let v = yMin; v <= yMax + step * 0.01; v += step) ticks.push(v);

  /* ── Currency formatter ── */
  const fmt = (v) => {
    const abs = Math.abs(v);
    const sign = v < 0 ? '-' : '';
    if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(1)}Cr`;
    if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(1)}L`;
    if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
    return `${sign}₹${Math.round(abs)}`;
  };

  /* ── Path generation (smooth cubic bezier) ── */
  const pts = points.map((p, i) => [gx(i), gy(p.balance)]);
  let linePath = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpX = (pts[i][0] + pts[i + 1][0]) / 2;
    linePath += ` C ${cpX} ${pts[i][1]}, ${cpX} ${pts[i + 1][1]}, ${pts[i + 1][0]} ${pts[i + 1][1]}`;
  }
  const areaPath = linePath + ` L ${pts[pts.length - 1][0]} ${bottomY} L ${pts[0][0]} ${bottomY} Z`;

  /* ── Colors based on trend direction ── */
  const accentPrimary = isUp ? '#00E676' : '#FF5252';    // Bright neon green / red
  const accentSecondary = isUp ? '#69F0AE' : '#FF8A80';
  const accentGlow = isUp ? 'rgba(0, 230, 118, 0.35)' : 'rgba(255, 82, 82, 0.35)';
  const accentSoft = isUp ? 'rgba(0, 230, 118, 0.08)' : 'rgba(255, 82, 82, 0.08)';

  /* ── X-axis labels ── */
  const xLabelCount = Math.min(6, points.length);
  const xLabels = [];
  for (let i = 0; i < xLabelCount; i++) {
    const idx = Math.round(i / (xLabelCount - 1) * (points.length - 1));
    if (!xLabels.includes(idx)) xLabels.push(idx);
  }

  const dateLabel = (pt) => {
    if (pt.date === 'Start' || !pt.date) return 'Start';
    try {
      const d = new Date(pt.date);
      if (activeRange === '1d') return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
      if (['1w', '1m'].includes(activeRange)) return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      return d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
    } catch { return ''; }
  };

  /* ── Hover state ── */
  const hov = hoverIdx !== null ? points[hoverIdx] : null;
  const hovX = hoverIdx !== null ? gx(hoverIdx) : 0;
  const hovY = hoverIdx !== null ? gy(points[hoverIdx].balance) : 0;

  /* ── Tooltip position ── */
  const TW = 170, TH = 68;
  let tipX = hoverIdx !== null ? hovX - TW / 2 : 0;
  if (tipX < PAD.l) tipX = PAD.l;
  if (tipX + TW > W - PAD.r) tipX = W - PAD.r - TW;
  const tipY = hoverIdx !== null ? (hovY - TH - 22 < PAD.t ? hovY + 22 : hovY - TH - 22) : 0;

  const uniqueId = `trendchart-${activeRange}`;

  return (
    <div style={{ width: '100%' }}>
      {/* ── Header Row: Title + Change Badge ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <h3 style={{
            fontSize: '1.05rem', fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '-0.015em', color: 'var(--text)',
            margin: 0
          }}>
            Balance Trend
          </h3>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 3, margin: 0 }}>
            Track your wealth over time
          </p>
        </div>

        {/* Change Badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 20,
          background: accentSoft,
          border: `1px solid ${isUp ? 'rgba(0,230,118,0.2)' : 'rgba(255,82,82,0.2)'}`,
        }}>
          <span style={{ fontSize: 14 }}>{isUp ? '▲' : '▼'}</span>
          <span style={{
            fontSize: '0.8rem', fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            color: accentPrimary
          }}>
            {isUp ? '+' : ''}{fmt(changeAmt)}
          </span>
          <span style={{
            fontSize: '0.68rem', fontWeight: 600,
            color: accentSecondary, opacity: 0.8
          }}>
            ({changePct >= 0 ? '+' : ''}{changePct.toFixed(1)}%)
          </span>
        </div>
      </div>

      {/* ── Time Range Selector Pills ── */}
      <div style={{
        display: 'flex', gap: 4,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12, padding: 3,
        marginBottom: 18,
        overflow: 'hidden'
      }}>
        {TIME_RANGES.map((r) => (
          <button
            key={r.id}
            onClick={() => setActiveRange(r.id)}
            style={{
              flex: 1,
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '7px 0',
              borderRadius: 9,
              border: 'none',
              background: activeRange === r.id
                ? `linear-gradient(135deg, ${accentPrimary}, ${accentSecondary})`
                : 'transparent',
              color: activeRange === r.id ? '#000' : 'var(--text-sub)',
              cursor: 'pointer',
              transition: 'all 0.22s cubic-bezier(.16,1,.3,1)',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '0.03em',
              boxShadow: activeRange === r.id ? `0 2px 12px ${accentGlow}` : 'none',
              textShadow: activeRange === r.id ? '0 1px 2px rgba(0,0,0,0.2)' : 'none',
            }}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* ── Chart SVG ── */}
      <div style={{
        width: '100%', height: 240,
        background: 'var(--surface)',
        borderRadius: 16,
        border: '1px solid var(--border)',
        padding: '8px 4px 4px 4px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Subtle glow effect behind chart */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: '20%', right: '20%',
          height: '60%',
          background: `radial-gradient(ellipse at center bottom, ${accentGlow} 0%, transparent 70%)`,
          pointerEvents: 'none',
          transition: 'background 0.4s ease',
        }} />

        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%" height="100%"
          style={{ overflow: 'visible', position: 'relative', zIndex: 1 }}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            {/* Area gradient */}
            <linearGradient id={`${uniqueId}-areaGrad`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={accentPrimary} stopOpacity="0.35" />
              <stop offset="40%" stopColor={accentPrimary} stopOpacity="0.15" />
              <stop offset="100%" stopColor={accentPrimary} stopOpacity="0" />
            </linearGradient>

            {/* Line shimmer gradient */}
            <linearGradient id={`${uniqueId}-lineGrad`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={accentSecondary} />
              <stop offset="50%" stopColor={accentPrimary} />
              <stop offset="100%" stopColor={accentSecondary} />
            </linearGradient>

            {/* Line glow filter */}
            <filter id={`${uniqueId}-lineGlow`} x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {/* Dot glow */}
            <filter id={`${uniqueId}-dotGlow`} x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>

            {/* Clip path */}
            <clipPath id={`${uniqueId}-clip`}>
              <rect x={PAD.l} y={0} width={PW} height={H} />
            </clipPath>
          </defs>

          {/* ── Grid lines & Y-axis labels ── */}
          {ticks.map((v, i) => {
            const y = gy(v);
            const isZero = Math.abs(v) < step * 0.01;
            return (
              <g key={i}>
                <line
                  x1={PAD.l} y1={y} x2={W - PAD.r} y2={y}
                  stroke={isZero ? 'var(--border-strong)' : 'var(--border-color)'}
                  strokeWidth={isZero ? 1 : 0.5}
                  strokeDasharray={isZero ? '0' : '3 6'}
                  opacity={0.6}
                />
                <text
                  x={PAD.l - 8} y={y + 3.5}
                  textAnchor="end"
                  fontSize={9.5}
                  fontWeight="700"
                  fill="var(--text-muted)"
                  opacity={0.85}
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {fmt(v)}
                </text>
              </g>
            );
          })}

          {/* ── Area fill ── */}
          <path
            d={areaPath}
            fill={`url(#${uniqueId}-areaGrad)`}
            clipPath={`url(#${uniqueId}-clip)`}
            style={{ opacity: 0, animation: 'trendAreaFadeIn 0.8s 0.3s ease forwards' }}
          />

          {/* ── Main trend line ── */}
          <path
            d={linePath}
            fill="none"
            stroke={`url(#${uniqueId}-lineGrad)`}
            strokeWidth={2.8}
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#${uniqueId}-lineGlow)`}
            style={{
              strokeDasharray: 3000,
              strokeDashoffset: 0,
              animation: 'trendLineDraw 1.4s cubic-bezier(.22,1,.36,1) forwards'
            }}
          />

          {/* ── Data dots ── */}
          {points.length <= 40 && points.map((pt, i) => {
            const x = gx(i), y = gy(pt.balance);
            const isActive = hoverIdx === i;
            return (
              <g key={i}>
                {/* Outer glow on hover */}
                {isActive && (
                  <>
                    <circle cx={x} cy={y} r={16} fill={accentPrimary} opacity={0.08} />
                    <circle cx={x} cy={y} r={8} fill={accentPrimary} opacity={0.15} />
                  </>
                )}
                <circle
                  cx={x} cy={y}
                  r={isActive ? 5 : (points.length > 20 ? 2 : 3)}
                  fill={isActive ? accentPrimary : 'var(--bg-raised)'}
                  stroke={accentPrimary}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{
                    transition: 'all .18s ease',
                    filter: isActive ? `drop-shadow(0 0 6px ${accentGlow})` : 'none'
                  }}
                />
              </g>
            );
          })}

          {/* ── Invisible hit zones ── */}
          {points.map((_, i) => (
            <rect
              key={i}
              x={gx(i) - PW / points.length / 2}
              y={PAD.t}
              width={PW / Math.max(points.length, 1)}
              height={PH}
              fill="transparent"
              style={{ cursor: 'crosshair' }}
              onMouseEnter={() => setHoverIdx(i)}
            />
          ))}

          {/* ── Hover crosshair + tooltip ── */}
          {hov && (
            <>
              {/* Vertical crosshair line */}
              <line
                x1={hovX} y1={PAD.t} x2={hovX} y2={bottomY}
                stroke={accentPrimary} strokeWidth={1}
                strokeDasharray="4 4" opacity={0.4}
              />
              {/* Horizontal crosshair */}
              <line
                x1={PAD.l} y1={hovY} x2={W - PAD.r} y2={hovY}
                stroke={accentPrimary} strokeWidth={0.6}
                strokeDasharray="2 5" opacity={0.2}
              />

              {/* Tooltip card */}
              <g style={{ animation: 'trendTooltipIn .12s ease' }}>
                <rect
                  x={tipX} y={tipY} width={TW} height={TH} rx={12}
                  fill="var(--modal)"
                  stroke={accentPrimary} strokeWidth={0.8} strokeOpacity={0.3}
                  style={{ filter: 'drop-shadow(0 8px 24px rgba(0,0,0,.25))' }}
                />
                {/* Accent bar at top */}
                <rect
                  x={tipX} y={tipY} width={TW} height={3} rx={0}
                  fill={accentPrimary} opacity={0.6}
                  style={{ clipPath: `inset(0 0 0 0 round 12px 12px 0 0)` }}
                />

                {/* Type label */}
                <text
                  x={tipX + 12} y={tipY + 18}
                  fontSize={8} fontWeight="700"
                  fill="var(--text-muted)"
                  style={{ textTransform: 'uppercase', letterSpacing: 1.2 }}
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {hoverIdx === 0 ? 'OPENING' : hov.type === 'income' ? '▲ INCOME' : hov.type === 'expense' ? '▼ EXPENSE' : 'BALANCE'}
                </text>

                {/* Balance amount */}
                <text
                  x={tipX + 12} y={tipY + 37}
                  fontSize={16} fontWeight="800"
                  fill={accentPrimary}
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {fmt(hov.balance)}
                </text>

                {/* Date + description */}
                <text
                  x={tipX + 12} y={tipY + 54}
                  fontSize={8.5} fontWeight="500"
                  fill="var(--text-muted)"
                  fontFamily="'Inter', sans-serif"
                >
                  {dateLabel(hov)}{hov.label && hov.label !== 'Opening' && hov.label !== 'Current' ? ` · ${hov.label.substring(0, 20)}${hov.label.length > 20 ? '…' : ''}` : ''}
                </text>
              </g>
            </>
          )}

          {/* ── X-axis dates ── */}
          {xLabels.map(i => (
            <text
              key={i}
              x={gx(i)}
              y={H - 6}
              textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
              fontSize={9}
              fontWeight="700"
              fill="var(--text-muted)"
              opacity={0.75}
              fontFamily="'Space Grotesk', sans-serif"
            >
              {dateLabel(points[i])}
            </text>
          ))}

          {/* ── Floating end-balance pill ── */}
          {points.length > 1 && (() => {
            const lx = gx(points.length - 1);
            const ly = gy(points[points.length - 1].balance);
            const text = fmt(points[points.length - 1].balance);
            const pillW = text.length * 7.5 + 20;
            const px = Math.min(lx - pillW / 2, W - PAD.r - pillW);
            const py = ly - 24;
            return (
              <g style={{ animation: 'trendTooltipIn .4s .8s ease backwards' }}>
                <rect
                  x={px} y={py} width={pillW} height={20} rx={10}
                  fill={accentPrimary} opacity={0.9}
                  style={{ filter: `drop-shadow(0 2px 8px ${accentGlow})` }}
                />
                <text
                  x={px + pillW / 2} y={py + 13.5}
                  textAnchor="middle"
                  fontSize={10} fontWeight="800" fill="#000"
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {text}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* ── Chart Animations ── */}
      <style>{`
        @keyframes trendLineDraw {
          from { stroke-dashoffset: 3000; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes trendAreaFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes trendTooltipIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
