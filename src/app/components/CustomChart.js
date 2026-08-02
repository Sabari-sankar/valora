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

  const slices = segments.map((seg, i) => {
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

    return { ...seg, d, lx, ly, midAngle, i };
  });

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

/* ─── AreaChart — Premium Enhanced Balance Trend ──────────────────── */
export function AreaChart({ existingSaving = 0, transactions = [] }) {
  const [hoverIdx, setHoverIdx] = React.useState(null);

  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
  let bal = Number(existingSaving);
  const points = [{ label: 'Opening Balance', balance: bal, date: 'Start', type: null }];
  sorted.forEach(tx => {
    bal += tx.type === 'income' ? Number(tx.amount) : -Number(tx.amount);
    points.push({ label: tx.description, balance: bal, date: tx.date, type: tx.type, amount: tx.amount });
  });

  /* ── Early exit ── */
  if (points.length === 1) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 10, color: 'var(--text-muted)' }}>
        <span style={{ fontSize: 36, filter: 'grayscale(0.3)' }}>📊</span>
        <p style={{ fontSize: 13, textAlign: 'center' }}>Add transactions to see your balance trend</p>
      </div>
    );
  }

  /* ── SVG Dimensions ── */
  const W = 520, H = 200;
  const PAD = { t: 24, r: 24, b: 36, l: 58 };
  const PW = W - PAD.l - PAD.r;
  const PH = H - PAD.t - PAD.b;

  const balances = points.map(p => p.balance);
  const maxV = Math.max(...balances, 0);
  const minV = Math.min(...balances, 0);
  const rawRange = maxV - minV || 1000;
  const yMax = maxV + rawRange * 0.18;
  const yMin = minV - rawRange * 0.12;
  const yRange = yMax - yMin;

  const gx = i => PAD.l + (i / Math.max(points.length - 1, 1)) * PW;
  const gy = v => PAD.t + (1 - (v - yMin) / yRange) * PH;
  const gy0 = gy(0); // y-position of the zero line

  /* ── Smooth Bezier path via control points ── */
  function smoothPath(pts) {
    if (pts.length < 2) return '';
    let d = `M ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const x0 = pts[i][0], y0 = pts[i][1];
      const x1 = pts[i + 1][0], y1 = pts[i + 1][1];
      const cpX = (x0 + x1) / 2;
      d += ` C ${cpX} ${y0}, ${cpX} ${y1}, ${x1} ${y1}`;
    }
    return d;
  }

  const xyPts = points.map((p, i) => [gx(i), gy(p.balance)]);
  const linePath = smoothPath(xyPts);

  /* ── Area fill path (close back to zero baseline) ── */
  const zeroY = Math.min(Math.max(gy0, PAD.t), H - PAD.b);
  const areaPath = linePath
    + ` L ${gx(points.length - 1)} ${zeroY}`
    + ` L ${gx(0)} ${zeroY} Z`;

  /* ── Grid values (4 levels) ── */
  const gridVals = [0, 1, 2, 3].map(i => yMin + (i / 3) * yRange);

  /* ── Number formatter ── */
  const fmt = v => {
    const abs = Math.abs(v);
    const sign = v < 0 ? '-' : '';
    if (abs >= 10000000) return `${sign}₹${(abs / 10000000).toFixed(1)}Cr`;
    if (abs >= 100000)   return `${sign}₹${(abs / 100000).toFixed(1)}L`;
    if (abs >= 1000)     return `${sign}₹${(abs / 1000).toFixed(1)}K`;
    return `${sign}₹${Math.round(abs)}`;
  };

  const hov = hoverIdx !== null ? points[hoverIdx] : null;
  const hovX = hoverIdx !== null ? gx(hoverIdx) : 0;
  const hovY = hoverIdx !== null ? gy(points[hoverIdx].balance) : 0;

  /* ── Tooltip positioning ── */
  const tipW = 130, tipH = 56, tipPad = 10;
  let tipX = hovX - tipW / 2;
  if (tipX < PAD.l) tipX = PAD.l;
  if (tipX + tipW > W - PAD.r) tipX = W - PAD.r - tipW;
  const tipY = hovY - tipH - 12 < PAD.t ? hovY + 12 : hovY - tipH - 12;

  /* ── Last point color ── */
  const lastBal = points[points.length - 1].balance;
  const trendColor = lastBal >= (points[0]?.balance ?? 0) ? 'var(--income-color)' : 'var(--expense-color)';

  const dateLabel = (pt, i) => {
    if (pt.date === 'Start') return 'Start';
    try {
      return new Date(pt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    } catch { return ''; }
  };

  return (
    <div style={{ width: '100%', height: '100%', userSelect: 'none' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        style={{ overflow: 'visible' }}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          {/* Gradient fill — positive */}
          <linearGradient id="areaGradPos" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--income-color)" stopOpacity="0.35" />
            <stop offset="85%"  stopColor="var(--income-color)" stopOpacity="0.02" />
          </linearGradient>
          {/* Gradient fill — negative */}
          <linearGradient id="areaGradNeg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--expense-color)" stopOpacity="0.02" />
            <stop offset="85%"  stopColor="var(--expense-color)" stopOpacity="0.3" />
          </linearGradient>
          {/* Glow filter for line */}
          <filter id="lineGlow" x="-5%" y="-40%" width="110%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Glow for active dot */}
          <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Clip so area stays inside chart bounds */}
          <clipPath id="chartClip">
            <rect x={PAD.l} y={PAD.t} width={PW} height={PH} />
          </clipPath>
        </defs>

        {/* ── Grid Lines & Y Labels ── */}
        {gridVals.map((v, i) => {
          const y = gy(v);
          const isZero = Math.abs(v) < rawRange * 0.02;
          return (
            <g key={i}>
              <line
                x1={PAD.l} y1={y} x2={W - PAD.r} y2={y}
                stroke={isZero ? 'rgba(255,255,255,0.12)' : 'var(--border-color)'}
                strokeWidth={isZero ? 1.5 : 1}
                strokeDasharray={isZero ? '0' : '4 5'}
              />
              <text
                x={PAD.l - 7} y={y + 4}
                textAnchor="end"
                fontSize={9} fontWeight="600"
                fill={isZero ? 'var(--text-sub)' : 'var(--text-muted)'}
              >
                {fmt(v)}
              </text>
            </g>
          );
        })}

        {/* ── Area Fill ── */}
        <path
          d={areaPath}
          fill={lastBal >= 0 ? 'url(#areaGradPos)' : 'url(#areaGradNeg)'}
          clipPath="url(#chartClip)"
        />

        {/* ── Main Trend Line ── */}
        <path
          d={linePath}
          fill="none"
          stroke={trendColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#lineGlow)"
          style={{
            strokeDasharray: 1000,
            strokeDashoffset: 0,
            animation: 'chartDraw 1.2s cubic-bezier(.16,1,.3,1) forwards',
          }}
        />

        {/* ── Event Markers (income = up arrow, expense = down) ── */}
        {points.map((pt, i) => {
          if (!pt.type || i === 0) return null;
          const x = gx(i), y = gy(pt.balance);
          const isInc = pt.type === 'income';
          return (
            <g key={i}>
              <circle
                cx={x} cy={y} r={hoverIdx === i ? 6 : 3.5}
                fill={isInc ? 'var(--income-color)' : 'var(--expense-color)'}
                stroke="var(--bg)"
                strokeWidth={hoverIdx === i ? 2.5 : 1.5}
                style={{ transition: 'r .15s, stroke-width .15s' }}
                filter={hoverIdx === i ? 'url(#dotGlow)' : ''}
              />
            </g>
          );
        })}

        {/* ── Start Dot ── */}
        <circle
          cx={gx(0)} cy={gy(points[0].balance)} r={4}
          fill="var(--primary)"
          stroke="var(--bg)" strokeWidth={2}
        />

        {/* ── Invisible hover hit-zones ── */}
        {points.map((pt, i) => (
          <rect
            key={i}
            x={gx(i) - (PW / points.length) / 2}
            y={PAD.t}
            width={PW / Math.max(points.length, 1)}
            height={PH}
            fill="transparent"
            style={{ cursor: 'crosshair' }}
            onMouseEnter={() => setHoverIdx(i)}
          />
        ))}

        {/* ── Hover Crosshair ── */}
        {hov && (
          <>
            <line
              x1={hovX} y1={PAD.t} x2={hovX} y2={H - PAD.b}
              stroke="var(--border-strong)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
            />
            {/* Active dot */}
            <circle
              cx={hovX} cy={hovY} r={7}
              fill={hov.balance >= 0 ? 'var(--income-color)' : 'var(--expense-color)'}
              stroke="var(--bg)" strokeWidth={2.5}
              filter="url(#dotGlow)"
            />

            {/* Tooltip box */}
            <rect
              x={tipX} y={tipY}
              width={tipW} height={tipH}
              rx={8}
              fill="var(--modal)"
              stroke="var(--border-strong)"
              strokeWidth={1}
              style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,.5))' }}
            />
            {/* Tip label */}
            <text
              x={tipX + tipPad} y={tipY + 16}
              fontSize={9} fontWeight="700" fill="var(--text-muted)"
              style={{ textTransform: 'uppercase', letterSpacing: 0.8 }}
            >
              {hoverIdx === 0 ? 'Opening' : hov.type === 'income' ? '▲ INCOME' : '▼ EXPENSE'}
            </text>
            {/* Amount */}
            <text
              x={tipX + tipPad} y={tipY + 32}
              fontSize={14} fontWeight="800"
              fill={hov.balance >= 0 ? 'var(--income-color)' : 'var(--expense-color)'}
              fontFamily="'Space Grotesk', sans-serif"
            >
              {fmt(hov.balance)}
            </text>
            {/* Date */}
            <text
              x={tipX + tipPad} y={tipY + 48}
              fontSize={9.5} fontWeight="500" fill="var(--text-muted)"
            >
              {dateLabel(hov, hoverIdx)} {hov.label && hov.label !== 'Opening Balance' ? `· ${hov.label.substring(0, 14)}${hov.label.length > 14 ? '…' : ''}` : ''}
            </text>
          </>
        )}

        {/* ── X Axis Date Labels ── */}
        {[0, Math.floor((points.length - 1) / 2), points.length - 1]
          .filter((v, i, a) => a.indexOf(v) === i && points[v])
          .map(i => (
            <text
              key={i} x={gx(i)} y={H - 6}
              textAnchor={i === 0 ? 'start' : i === points.length - 1 ? 'end' : 'middle'}
              fontSize={9} fontWeight="600" fill="var(--text-muted)"
            >
              {dateLabel(points[i], i)}
            </text>
          ))}

        {/* ── Last balance label ── */}
        {points.length > 1 && (
          <text
            x={gx(points.length - 1) + 5}
            y={gy(points[points.length - 1].balance) - 8}
            fontSize={9.5} fontWeight="800"
            fill={trendColor}
            fontFamily="'Space Grotesk', sans-serif"
          >
            {fmt(points[points.length - 1].balance)}
          </text>
        )}
      </svg>

      {/* ── CSS animation for line draw ── */}
      <style>{`
        @keyframes chartDraw {
          from { stroke-dashoffset: 1000; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

/* ─── DonutChart (kept for legacy compat — wraps PieChart) ──────────── */
export function DonutChart({ transactions = [], categories = [] }) {
  return <PieChart transactions={transactions} categories={categories} mode="expense" />;
}
