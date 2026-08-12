'use client';
import React, { useState } from 'react';

/* ─── Palette (mirrors CSS vars for SVG usage) ─────────────────────── */
const COLORS = [
  '#5b8dee','#2dd4bf','#fb7185','#fbbf24',
  '#a78bfa','#34d399','#f472b6','#60a5fa',
  '#f97316','#e879f9','#4ade80','#facc15',
];

/* ─── PieChart ─────────────────────────────────────────────────────── */
/**
 * Full pizza/pie chart — shows both income and expense categories.
 * Props:
 *   transactions – array of tx objects
 *   categories   – array of category config objects
 *   mode         – 'expense' | 'income' | 'both'
 */
export function PieChart({ transactions = [], categories = [], mode = 'both' }) {
  const [active, setActive] = useState(null);

  /* ── Build segments ── */
  const filtered = mode === 'both'
    ? transactions
    : transactions.filter(t => t.type === mode);

  const map = {};
  let total = 0;
  filtered.forEach(t => {
    const amt = Number(t.amount);
    map[t.category] = (map[t.category] || 0) + amt;
    total += amt;
  });

  if (total === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: 52, marginBottom: 12 }}>🍕</div>
        <p style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>No data yet</p>
        <p style={{ fontSize: 12.5 }}>Add transactions to see your spending chart.</p>
      </div>
    );
  }

  const segments = Object.entries(map)
    .map(([name, amount], i) => {
      const catCfg = categories.find(c => c.name.toLowerCase() === name.toLowerCase()) || {};
      const isIncome = transactions.find(t => t.category.toLowerCase() === name.toLowerCase())?.type === 'income';
      return {
        name,
        amount,
        pct: (amount / total) * 100,
        color: catCfg.color || COLORS[i % COLORS.length],
        isIncome,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  /* ── SVG Pie Geometry ── */
  const CX = 110, CY = 110, R = 95, INNER_R = 48;
  let angle = -Math.PI / 2; // start top

  const slices = [];
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const sweep = (seg.pct / 100) * 2 * Math.PI;
    const startAngle = angle;
    const endAngle = angle + sweep;
    angle = endAngle;

    const x1 = CX + R * Math.cos(startAngle);
    const y1 = CY + R * Math.sin(startAngle);
    const x2 = CX + R * Math.cos(endAngle);
    const y2 = CY + R * Math.sin(endAngle);
    const ix1 = CX + INNER_R * Math.cos(startAngle);
    const iy1 = CY + INNER_R * Math.sin(startAngle);
    const ix2 = CX + INNER_R * Math.cos(endAngle);
    const iy2 = CY + INNER_R * Math.sin(endAngle);
    const largeArc = sweep > Math.PI ? 1 : 0;

    const midAngle = startAngle + sweep / 2;
    const labelR = (R + INNER_R) / 2 + 2;
    const lx = CX + labelR * Math.cos(midAngle);
    const ly = CY + labelR * Math.sin(midAngle);

    const d = [
      `M ${ix1} ${iy1}`,
      `L ${x1} ${y1}`,
      `A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${ix1} ${iy1}`,
      'Z'
    ].join(' ');

    slices.push({ ...seg, d, lx, ly, midAngle, i });
  }

  const activeSlice = active !== null ? slices[active] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      {/* ── Pizza SVG ── */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <svg
          width={220} height={220}
          viewBox="0 0 220 220"
          style={{ overflow: 'visible', cursor: 'pointer' }}
        >
          <defs>
            {slices.map((sl, i) => (
              <filter key={i} id={`glow${i}`} x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            ))}
          </defs>

          {slices.map((sl, i) => {
            const isActive = active === i;
            const scale = isActive ? 1.06 : 1;
            const tx = CX + (CX - CX) * (scale - 1);
            const ty = CY + (CY - CY) * (scale - 1);
            return (
              <g
                key={i}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
                style={{ cursor: 'pointer' }}
              >
                <path
                  d={sl.d}
                  fill={sl.color}
                  stroke="var(--bg)"
                  strokeWidth={isActive ? 3 : 1.5}
                  style={{
                    transform: isActive
                      ? `translate(${Math.cos(sl.midAngle) * 6}px, ${Math.sin(sl.midAngle) * 6}px)`
                      : 'none',
                    transition: 'transform .2s cubic-bezier(.34,1.56,.64,1), stroke-width .15s',
                    filter: isActive ? `drop-shadow(0 0 8px ${sl.color})` : 'none',
                    opacity: active !== null && !isActive ? 0.6 : 1,
                  }}
                />
                {/* Show % label inside slice if big enough */}
                {sl.pct > 10 && (
                  <text
                    x={sl.lx} y={sl.ly}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={10} fontWeight="700" fill="#fff"
                    style={{ pointerEvents: 'none', opacity: active !== null && !isActive ? 0.4 : 0.9 }}
                  >
                    {sl.pct.toFixed(0)}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Center info */}
          <circle cx={CX} cy={CY} r={INNER_R - 2} fill="var(--bg-raised)" opacity={0.92} />
          {activeSlice ? (
            <>
              <text x={CX} y={CY - 11} textAnchor="middle" fontSize={9} fontWeight="700" fill="var(--text-muted)" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                {activeSlice.name.length > 10 ? activeSlice.name.substring(0, 10) + '…' : activeSlice.name}
              </text>
              <text x={CX} y={CY + 5} textAnchor="middle" fontSize={13} fontWeight="800" fill={activeSlice.color}>
                ₹{Number(activeSlice.amount).toLocaleString('en-IN')}
              </text>
              <text x={CX} y={CY + 21} textAnchor="middle" fontSize={10} fontWeight="600" fill="var(--text-muted)">
                {activeSlice.pct.toFixed(1)}%
              </text>
            </>
          ) : (
            <>
              <text x={CX} y={CY - 8} textAnchor="middle" fontSize={9} fontWeight="700" fill="var(--text-muted)" style={{ letterSpacing: 1 }}>TOTAL</text>
              <text x={CX} y={CY + 8} textAnchor="middle" fontSize={13} fontWeight="800" fill="var(--text)">
                ₹{total.toLocaleString('en-IN')}
              </text>
            </>
          )}
        </svg>
      </div>

      {/* ── Legend ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {slices.map((sl, i) => (
          <div
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '7px 10px', borderRadius: 10,
              background: active === i ? 'var(--surface-hover)' : 'transparent',
              transition: 'background .15s', cursor: 'pointer',
              opacity: active !== null && active !== i ? 0.55 : 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{
                width: 10, height: 10, borderRadius: '50%',
                background: sl.color,
                boxShadow: `0 0 6px ${sl.color}`,
                flexShrink: 0, display: 'inline-block'
              }} />
              <span style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)' }}>
                {sl.name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600, color: sl.color }}>
                ₹{Number(sl.amount).toLocaleString('en-IN')}
              </span>
              <span style={{
                fontSize: 9.5, fontWeight: 700, color: 'var(--text-muted)',
                background: 'var(--surface)', padding: '1px 5px', borderRadius: 4
              }}>
                {sl.pct.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── AreaChart — Modern Financial Dashboard Chart ──────────────────── */
export function AreaChart({ existingSaving = 0, transactions = [], type = 'area' }) {
  const [hoverIdx, setHoverIdx] = React.useState(null);

  /* ── Data preparation ── */
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  let bal = Number(existingSaving);
  const rawPoints = [{ label: 'Opening', balance: bal, date: 'Start', type: null, amount: 0 }];
  sorted.forEach(tx => {
    bal += tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount);
    rawPoints.push({ label: tx.description, balance: bal, date: tx.date, type: tx.type, amount: Number(tx.amount) });
  });

  /* ── Downsample for clarity (max 30 pts) ── */
  const MAX_PTS = 30;
  let points = rawPoints;
  if (rawPoints.length > MAX_PTS) {
    const bucketSize = Math.ceil(rawPoints.length / MAX_PTS);
    points = [rawPoints[0]];
    for (let i = 1; i < rawPoints.length; i += bucketSize) {
      const slice = rawPoints.slice(i, i + bucketSize);
      const last = slice[slice.length - 1];
      const totalAmt = slice.reduce((s, p) => s + (p.amount || 0), 0);
      const incC = slice.filter(p => p.type === 'income').length;
      const expC = slice.filter(p => p.type === 'expense').length;
      points.push({ label: last.label, balance: last.balance, date: last.date, type: incC >= expC ? 'income' : 'expense', amount: totalAmt });
    }
  }

  /* ── Empty state ── */
  if (points.length <= 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 12, color: 'var(--text-muted)', padding: '30px 0' }}>
        <span style={{ fontSize: 36, opacity: 0.6 }}>📈</span>
        <p style={{ fontSize: 13, textAlign: 'center', fontWeight: 500 }}>Add transactions to see your balance trend</p>
      </div>
    );
  }

  /* ── Nice axis scaling (Heckbert) ── */
  const balances = points.map(p => p.balance);
  const dataMax = Math.max(...balances, 0);
  const dataMin = Math.min(...balances, 0);
  const dataRange = dataMax - dataMin || 1000;

  function niceStep(range) {
    const rough = range / 4;
    const pow10 = Math.pow(10, Math.floor(Math.log10(rough)));
    const r = rough / pow10;
    const nice = r < 1.5 ? 1 : r < 3 ? 2 : r < 7.5 ? 5 : 10;
    return nice * pow10;
  }

  const step = niceStep(dataRange);
  const yMin = Math.floor(dataMin / step) * step;
  const yMax = Math.ceil(dataMax / step) * step;
  const yRange = yMax - yMin || 1000;

  /* ── Number formatter ── */
  const fmt = v => {
    const abs = Math.abs(v); const sign = v < 0 ? '-' : '';
    if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(1)}Cr`;
    if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(1)}L`;
    if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
    return `${sign}₹${Math.round(abs)}`;
  };

  /* ── Grid ticks ── */
  const ticks = [];
  for (let v = yMin; v <= yMax + step * 0.01; v += step) ticks.push(v);

  /* ── Dynamic left padding ── */
  const longest = Math.max(...ticks.map(v => fmt(v).length));
  const PAD_L = Math.max(52, longest * 7.5 + 6);

  /* ── Layout ── */
  const W = 540, H = 210;
  const PAD = { t: 22, r: 22, b: 34, l: PAD_L };
  const PW = W - PAD.l - PAD.r, PH = H - PAD.t - PAD.b;
  const gx = i => PAD.l + (i / Math.max(points.length - 1, 1)) * PW;
  const gy = v => PAD.t + (1 - (v - yMin) / yRange) * PH;
  const bottomY = H - PAD.b;

  /* ── Smooth cubic bezier path ── */
  const pts = points.map((p, i) => [gx(i), gy(p.balance)]);
  let linePath = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const cpX = (pts[i][0] + pts[i + 1][0]) / 2;
    linePath += ` C ${cpX} ${pts[i][1]}, ${cpX} ${pts[i + 1][1]}, ${pts[i + 1][0]} ${pts[i + 1][1]}`;
  }
  const areaPath = linePath + ` L ${pts[pts.length - 1][0]} ${bottomY} L ${pts[0][0]} ${bottomY} Z`;

  /* ── Trend direction colours ── */
  const lastBal = points[points.length - 1].balance;
  const firstBal = points[0].balance;
  const isUp = lastBal >= firstBal;
  const accent = isUp ? '#10b981' : '#8b5cf6';
  const accentLight = isUp ? '#34d399' : '#c4b5fd';

  /* ── Hover state ── */
  const hov = hoverIdx !== null ? points[hoverIdx] : null;
  const hovX = hoverIdx !== null ? gx(hoverIdx) : 0;
  const hovY = hoverIdx !== null ? gy(points[hoverIdx].balance) : 0;

  /* ── Date formatter ── */
  const dateLabel = pt => {
    if (pt.date === 'Start') return 'Start';
    try { return new Date(pt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); }
    catch { return ''; }
  };

  /* ── Tooltip position ── */
  const TW = 148, TH = 56, TP = 10;
  let tipX = hovX - TW / 2;
  if (tipX < PAD.l) tipX = PAD.l;
  if (tipX + TW > W - PAD.r) tipX = W - PAD.r - TW;
  const tipY = hovY - TH - 18 < PAD.t ? hovY + 18 : hovY - TH - 18;

  /* ── X-axis label positions ── */
  const xCount = Math.min(5, points.length);
  const xLabels = [];
  for (let i = 0; i < xCount; i++) {
    const idx = Math.round(i / (xCount - 1) * (points.length - 1));
    if (!xLabels.includes(idx)) xLabels.push(idx);
  }

  return (
    <div style={{ width: '100%', height: '100%', userSelect: 'none' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: 'visible' }} onMouseLeave={() => setHoverIdx(null)}>
        <defs>
          {/* Area gradient */}
          <linearGradient id="modernAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
            <stop offset="60%" stopColor={accent} stopOpacity="0.08" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
          {/* Line glow */}
          <filter id="modernLineGlow" x="-5%" y="-40%" width="110%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Dot glow */}
          <filter id="modernDotGlow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          {/* Clip */}
          <clipPath id="modernClip"><rect x={PAD.l} y={0} width={PW} height={H} /></clipPath>
          {/* Bar gradients */}
          <linearGradient id="barGradUp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="barGradDn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c4b5fd" /><stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>

        {/* ── Grid lines & Y labels ── */}
        {ticks.map((v, i) => {
          const y = gy(v);
          const isZero = Math.abs(v) < step * 0.01;
          return (
            <g key={i}>
              <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y}
                stroke={isZero ? 'var(--border-strong)' : 'var(--border-color)'}
                strokeWidth={isZero ? 0.8 : 0.5}
                strokeDasharray={isZero ? '0' : '2 5'}
                opacity={0.5}
              />
              <text x={PAD.l - 6} y={y + 3} textAnchor="end" fontSize={8.5} fontWeight="600" fill="var(--text-muted)" opacity={0.75}>
                {fmt(v)}
              </text>
            </g>
          );
        })}

        {/* ── Volume bars (combined / bar mode) ── */}
        {(type === 'combined' || type === 'bar') && (() => {
          const gy0 = gy(0);
          const maxAmt = Math.max(...points.map(p => p.amount || 0), 1);
          const maxBarH = PH * 0.2;
          const barW = Math.max(4, Math.min(16, PW / points.length * 0.45));
          return points.map((pt, i) => {
            if (i === 0 || !pt.type) return null;
            const x = gx(i) - barW / 2;
            const isBarMode = type === 'bar';
            let bY, bH;
            if (isBarMode) {
              bY = Math.min(gy(pt.balance), gy0);
              bH = Math.max(2, Math.abs(gy(pt.balance) - gy0));
            } else {
              bH = Math.max(1, (pt.amount / maxAmt) * maxBarH);
              bY = bottomY - bH;
            }
            return (
              <rect key={i} x={x} y={bY} width={barW} height={bH}
                fill={pt.type === 'income' ? 'url(#barGradUp)' : 'url(#barGradDn)'}
                rx={3} opacity={hoverIdx === i ? 0.9 : (isBarMode ? 0.65 : 0.14)}
                style={{ transition: 'opacity .2s ease' }}
              />
            );
          });
        })()}

        {/* ── Area fill ── */}
        {(type === 'combined' || type === 'area') && (
          <path d={areaPath} fill="url(#modernAreaGrad)" clipPath="url(#modernClip)"
            style={{ opacity: 0, animation: 'fadeAreaIn .8s .3s ease forwards' }}
          />
        )}

        {/* ── Main trend line ── */}
        {type !== 'bar' && (
          <path d={linePath} fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"
            filter="url(#modernLineGlow)"
            style={{ strokeDasharray: 2500, strokeDashoffset: 0, animation: 'modernDraw 1.6s cubic-bezier(.22,1,.36,1) forwards' }}
          />
        )}

        {/* ── Data dots ── */}
        {points.length <= 30 && points.map((pt, i) => {
          if (i === 0) return null;
          const x = gx(i), y = gy(pt.balance);
          const active = hoverIdx === i;
          return (
            <g key={i}>
              {/* Soft halo on hover */}
              {active && <circle cx={x} cy={y} r={12} fill={accent} opacity={0.1} />}
              <circle cx={x} cy={y}
                r={active ? 4.5 : 2.5}
                fill={active ? accent : 'var(--bg)'}
                stroke={accent}
                strokeWidth={active ? 2 : 1.5}
                style={{ transition: 'all .18s ease' }}
              />
            </g>
          );
        })}

        {/* ── Start dot ── */}
        <circle cx={gx(0)} cy={gy(points[0].balance)} r={3.5} fill={accent} stroke="var(--bg)" strokeWidth={2} />

        {/* ── Invisible hit zones ── */}
        {points.map((_, i) => (
          <rect key={i} x={gx(i) - PW / points.length / 2} y={PAD.t} width={PW / Math.max(points.length, 1)} height={PH}
            fill="transparent" style={{ cursor: 'crosshair' }} onMouseEnter={() => setHoverIdx(i)}
          />
        ))}

        {/* ── Hover overlay ── */}
        {hov && (
          <>
            {/* Crosshair vertical */}
            <line x1={hovX} y1={PAD.t} x2={hovX} y2={bottomY} stroke={accent} strokeWidth={0.8} strokeDasharray="3 4" opacity={0.3} />
            {/* Crosshair horizontal */}
            <line x1={PAD.l} y1={hovY} x2={W - PAD.r} y2={hovY} stroke={accent} strokeWidth={0.5} strokeDasharray="2 4" opacity={0.15} />

            {/* Tooltip glass card */}
            <g style={{ animation: 'tooltipFadeIn .12s ease' }}>
              <rect x={tipX} y={tipY} width={TW} height={TH} rx={10}
                fill="var(--modal)" stroke={accent} strokeWidth={0.6} strokeOpacity={0.25}
                style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,.15))' }}
              />
              {/* Label */}
              <text x={tipX + TP} y={tipY + 15} fontSize={8} fontWeight="700" fill="var(--text-muted)"
                style={{ textTransform: 'uppercase', letterSpacing: 1.2 }}
              >
                {hoverIdx === 0 ? 'OPENING' : hov.type === 'income' ? '▲ Income' : '▼ Expense'}
              </text>
              {/* Balance value */}
              <text x={tipX + TP} y={tipY + 32} fontSize={14} fontWeight="800" fill={accent} fontFamily="'Space Grotesk',sans-serif">
                {fmt(hov.balance)}
              </text>
              {/* Date + description */}
              <text x={tipX + TP} y={tipY + 46} fontSize={8} fontWeight="500" fill="var(--text-muted)">
                {dateLabel(hov)}{hov.label && hov.label !== 'Opening' ? ` · ${hov.label.substring(0, 18)}${hov.label.length > 18 ? '…' : ''}` : ''}
              </text>
            </g>
          </>
        )}

        {/* ── X Axis dates ── */}
        {xLabels.map(i => (
          <text key={i} x={gx(i)} y={H - 8}
            textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
            fontSize={8.5} fontWeight="600" fill="var(--text-muted)" opacity={0.65}
          >
            {dateLabel(points[i])}
          </text>
        ))}

        {/* ── Floating end-balance pill ── */}
        {points.length > 1 && (() => {
          const lx = gx(points.length - 1);
          const ly = gy(lastBal);
          const text = fmt(lastBal);
          const pillW = text.length * 7 + 18;
          const px = Math.min(lx - pillW / 2, W - PAD.r - pillW);
          const py = ly - 22;
          return (
            <g style={{ animation: 'tooltipFadeIn .4s .8s ease backwards' }}>
              <rect x={px} y={py} width={pillW} height={18} rx={9} fill={accent} opacity={0.88} />
              <text x={px + pillW / 2} y={py + 12.5} textAnchor="middle"
                fontSize={9} fontWeight="800" fill="#fff" fontFamily="'Space Grotesk',sans-serif"
              >
                {text}
              </text>
            </g>
          );
        })()}
      </svg>

      <style>{`
        @keyframes modernDraw {
          from { stroke-dashoffset: 2500; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes fadeAreaIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes tooltipFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── DonutChart (kept for legacy compat — wraps PieChart) ──────────── */
export function DonutChart({ transactions = [], categories = [] }) {
  return <PieChart transactions={transactions} categories={categories} mode="expense" />;
}

/* ─── MonthlyBarChart — Income vs Expenses Bar Chart ────────────────── */
export function MonthlyBarChart({ transactions = [] }) {
  const monthlyGroups = {};
  transactions.forEach(t => {
    if (!t.date) return;
    const [year, month] = t.date.split('-');
    const monthKey = `${year}-${month}`;
    if (!monthlyGroups[monthKey]) {
      monthlyGroups[monthKey] = { monthKey, income: 0, expense: 0 };
    }
    const amt = Number(t.amount) || 0;
    if (t.type === 'income') {
      monthlyGroups[monthKey].income += amt;
    } else {
      monthlyGroups[monthKey].expense += amt;
    }
  });

  const sortedMonths = Object.values(monthlyGroups).sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  if (sortedMonths.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: 13 }}>Add transactions to see your monthly chart</p>
      </div>
    );
  }

  const W = 520, H = 220;
  const PAD = { t: 20, r: 20, b: 30, l: 58 };
  const PW = W - PAD.l - PAD.r;
  const PH = H - PAD.t - PAD.b;

  const maxVal = Math.max(...sortedMonths.flatMap(m => [m.income, m.expense]), 1000);
  
  const formatMonthLabel = (key) => {
    const [year, month] = key.split('-');
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  };

  const gx = (index) => PAD.l + (index / sortedMonths.length) * PW + (PW / sortedMonths.length) * 0.1;
  const gy = (val) => PAD.t + (1 - val / (maxVal * 1.1)) * PH;
  
  const colWidth = (PW / sortedMonths.length) * 0.8;
  const barW = Math.max(4, colWidth / 2 - 4);

  const fmt = v => {
    const abs = Math.abs(v);
    if (abs >= 100000) return `₹${(abs / 100000).toFixed(1)}L`;
    if (abs >= 1000) return `₹${(abs / 1000).toFixed(1)}K`;
    return `₹${Math.round(abs)}`;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const v = ratio * maxVal;
          const y = gy(v);
          return (
            <g key={i}>
              <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="var(--border-color)" strokeWidth={1} strokeDasharray="4 4" />
              <text x={PAD.l - 7} y={y + 4} textAnchor="end" fontSize={9} fontWeight="600" fill="var(--text-muted)">
                {fmt(v)}
              </text>
            </g>
          );
        })}

        {sortedMonths.map((m, idx) => {
          const startX = gx(idx);
          const yInc = gy(m.income);
          const yExp = gy(m.expense);
          const hInc = Math.max(0, gy(0) - yInc);
          const hExp = Math.max(0, gy(0) - yExp);
          const monthLabel = formatMonthLabel(m.monthKey);

          return (
            <g key={m.monthKey}>
              <rect
                x={startX}
                y={yInc}
                width={barW}
                height={hInc}
                fill="var(--income-color)"
                rx={2}
                opacity={0.85}
              />
              <rect
                x={startX + barW + 4}
                y={yExp}
                width={barW}
                height={hExp}
                fill="var(--expense-color)"
                rx={2}
                opacity={0.85}
              />
              <text
                x={startX + barW + 2}
                y={H - 8}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight="600"
                fill="var(--text-muted)"
              >
                {monthLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ─── MonthlyLineChart — Cumulative Balance Net Graph ────────────────── */
export function MonthlyLineChart({ transactions = [], existingSaving = 0 }) {
  const monthlyGroups = {};
  transactions.forEach(t => {
    if (!t.date) return;
    const [year, month] = t.date.split('-');
    const monthKey = `${year}-${month}`;
    if (!monthlyGroups[monthKey]) {
      monthlyGroups[monthKey] = { monthKey, netFlow: 0 };
    }
    const amt = Number(t.amount) || 0;
    monthlyGroups[monthKey].netFlow += t.type === 'income' ? amt : -amt;
  });

  const sortedMonths = Object.values(monthlyGroups).sort((a, b) => a.monthKey.localeCompare(b.monthKey));

  if (sortedMonths.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
        <p style={{ fontSize: 13 }}>Add transactions to see net cash flow trend graph</p>
      </div>
    );
  }

  let cumulative = Number(existingSaving);
  const dataPoints = sortedMonths.map(m => {
    cumulative += m.netFlow;
    return {
      monthKey: m.monthKey,
      balance: cumulative
    };
  });

  const W = 520, H = 220;
  const PAD = { t: 20, r: 20, b: 30, l: 58 };
  const PW = W - PAD.l - PAD.r;
  const PH = H - PAD.t - PAD.b;

  const balances = dataPoints.map(p => p.balance);
  const maxV = Math.max(...balances, 0);
  const minV = Math.min(...balances, 0);
  const range = maxV - minV || 1000;
  const yMax = maxV + range * 0.15;
  const yMin = minV - range * 0.1;
  const yRange = yMax - yMin;

  const gx = (index) => PAD.l + (index / Math.max(dataPoints.length - 1, 1)) * PW;
  const gy = (val) => PAD.t + (1 - (val - yMin) / yRange) * PH;

  const linePoints = dataPoints.map((p, i) => [gx(i), gy(p.balance)]);
  let linePath = '';
  if (linePoints.length > 1) {
    linePath = `M ${linePoints[0][0]} ${linePoints[0][1]}`;
    for (let i = 0; i < linePoints.length - 1; i++) {
      const x0 = linePoints[i][0], y0 = linePoints[i][1];
      const x1 = linePoints[i + 1][0], y1 = linePoints[i + 1][1];
      const cpX = (x0 + x1) / 2;
      linePath += ` C ${cpX} ${y0}, ${cpX} ${y1}, ${x1} ${y1}`;
    }
  }

  const formatMonthLabel = (key) => {
    const [year, month] = key.split('-');
    return new Date(Number(year), Number(month) - 1, 1).toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
  };

  const fmt = v => {
    const abs = Math.abs(v);
    const sign = v < 0 ? '-' : '';
    if (abs >= 100000) return `${sign}₹${(abs / 100000).toFixed(1)}L`;
    if (abs >= 1000) return `${sign}₹${(abs / 1000).toFixed(1)}K`;
    return `${sign}₹${Math.round(abs)}`;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: 'visible' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
          const v = yMin + ratio * yRange;
          const y = gy(v);
          return (
            <g key={i}>
              <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke="var(--border-color)" strokeWidth={1} strokeDasharray="4 4" />
              <text x={PAD.l - 7} y={y + 4} textAnchor="end" fontSize={9} fontWeight="600" fill="var(--text-muted)">
                {fmt(v)}
              </text>
            </g>
          );
        })}

        {linePath && (
          <path
            d={linePath}
            fill="none"
            stroke="var(--primary)"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 1000,
              strokeDashoffset: 0,
              animation: 'chartDraw 1s cubic-bezier(.16,1,.3,1) forwards',
            }}
          />
        )}

        {dataPoints.map((pt, i) => {
          const x = gx(i);
          const y = gy(pt.balance);
          const monthLabel = formatMonthLabel(pt.monthKey);

          return (
            <g key={pt.monthKey}>
              <circle
                cx={x}
                cy={y}
                r={4.5}
                fill="var(--primary)"
                stroke="var(--bg)"
                strokeWidth={2}
              />
              <text
                x={x}
                y={H - 8}
                textAnchor="middle"
                fontSize={9.5}
                fontWeight="600"
                fill="var(--text-muted)"
              >
                {monthLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
