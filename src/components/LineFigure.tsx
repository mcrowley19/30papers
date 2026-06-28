import type { CSSProperties, ReactNode } from "react";
import type { FigureKey } from "../lib/figures";

/**
 * Precise thin line-art figures, one per paper idea. Each figure is drawn as
 * resolution-independent SVG on a shared 96x64 canvas in `currentColor`, with
 * crisp 1px strokes (`non-scaling-stroke`) so a figure stays hairline-sharp at
 * any rendered size. Static and monochrome: no halftone, no noise, no photos.
 *
 * These are the specimen drawings of the list, paired to papers in
 * `src/lib/figures.ts` and rendered beside each typeset row.
 */

const VB_W = 96;
const VB_H = 64;

// Shared stroke style: hairline currentColor lines, rounded ends.
const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};
const node = {
  fill: "currentColor",
  stroke: "none",
  vectorEffect: "non-scaling-stroke" as const,
};

/** Self-attention: a query fanning weighted arcs to a row of key tokens. */
function attention(): ReactNode {
  const xs = [10, 24, 38, 52, 66, 80];
  const baseY = 48;
  const q = 38; // query x position
  return (
    <>
      <path {...stroke} d={`M6 ${baseY} H90`} opacity={0.35} />
      {xs.map((x) => {
        if (x === q) return null;
        const mx = (q + x) / 2;
        const lift = baseY - (14 + Math.abs(x - q) * 0.32);
        return (
          <path key={x} {...stroke} d={`M${q} ${baseY} Q ${mx} ${lift} ${x} ${baseY}`} />
        );
      })}
      {xs.map((x) => (
        <circle key={x} {...node} cx={x} cy={baseY} r={1.7} />
      ))}
      <circle {...stroke} cx={q} cy={baseY} r={3.4} />
    </>
  );
}

/** Residual block: a stream through a transform with a skip bypass and a sum. */
function residual(): ReactNode {
  const x = 48;
  return (
    <>
      <circle {...node} cx={x} cy={9} r={1.8} />
      <path {...stroke} d={`M${x} 11 V20`} />
      <rect {...stroke} x={x - 13} y={20} width={26} height={18} rx={2} />
      <path {...stroke} d={`M${x - 13} 29 H${x + 13}`} opacity={0.4} />
      <path {...stroke} d={`M${x} 38 V44`} />
      {/* bypass arc around the block */}
      <path {...stroke} d={`M${x} 13 C 78 17, 78 41, ${x} 45`} />
      {/* sum node */}
      <circle {...stroke} cx={x} cy={48} r={4} />
      <path {...stroke} d={`M${x - 2.2} 48 H${x + 2.2} M${x} 45.8 V50.2`} />
      <path {...stroke} d={`M${x} 52 V58`} />
      <circle {...node} cx={x} cy={59} r={1.8} />
    </>
  );
}

/** Unrolled recurrence: a chain of cells passing hidden state left to right. */
function recurrence(): ReactNode {
  const cells = [16, 48, 80];
  const cy = 34;
  const half = 9;
  return (
    <>
      {cells.map((cx, i) => (
        <g key={cx}>
          <rect {...stroke} x={cx - half} y={cy - half} width={half * 2} height={half * 2} rx={2} />
          {/* input from below */}
          <path {...stroke} d={`M${cx} ${cy + half} V${cy + half + 9}`} />
          <circle {...node} cx={cx} cy={cy + half + 11} r={1.5} />
          {/* output above */}
          <path {...stroke} d={`M${cx} ${cy - half} V${cy - half - 9}`} />
          <circle {...node} cx={cx} cy={cy - half - 11} r={1.5} />
          {/* recurrent edge to the next cell */}
          {i < cells.length - 1 && (
            <path {...stroke} d={`M${cx + half} ${cy} H${cells[i + 1] - half - 3}`} />
          )}
          {i < cells.length - 1 && (
            <path
              {...stroke}
              d={`M${cells[i + 1] - half - 6} ${cy - 2.4} l3.4 2.4 l-3.4 2.4`}
            />
          )}
        </g>
      ))}
    </>
  );
}

/** Message-passing graph: a small set of nodes exchanging messages on edges. */
function graph(): ReactNode {
  const pts: Array<[number, number]> = [
    [18, 18],
    [50, 11],
    [82, 22],
    [30, 48],
    [62, 52],
    [86, 46],
  ];
  const edges: Array<[number, number]> = [
    [0, 1],
    [1, 2],
    [0, 3],
    [1, 4],
    [3, 4],
    [4, 5],
    [2, 5],
    [1, 3],
  ];
  return (
    <>
      {edges.map(([a, b], i) => (
        <path
          key={i}
          {...stroke}
          d={`M${pts[a][0]} ${pts[a][1]} L${pts[b][0]} ${pts[b][1]}`}
          opacity={0.5}
        />
      ))}
      {pts.map(([x, y], i) => (
        <circle key={i} {...stroke} cx={x} cy={y} r={3} />
      ))}
    </>
  );
}

/** Scaling law: a straight power-law trend on log-log axes. */
function scaling(): ReactNode {
  const ax = 16;
  const ay = 52;
  return (
    <>
      <path {...stroke} d={`M${ax} 8 V${ay} H88`} opacity={0.45} />
      {/* axis ticks */}
      <path {...stroke} d={`M${ax - 2.5} 18 H${ax}`} opacity={0.45} />
      <path {...stroke} d={`M${ax - 2.5} 35 H${ax}`} opacity={0.45} />
      <path {...stroke} d={`M40 ${ay} V${ay + 2.5}`} opacity={0.45} />
      <path {...stroke} d={`M64 ${ay} V${ay + 2.5}`} opacity={0.45} />
      {/* power-law trend: straight on log-log */}
      <path {...stroke} d={`M22 14 L84 48`} />
      {/* a few measurements settled on the line */}
      <circle {...node} cx={30} cy={18.5} r={1.5} />
      <circle {...node} cx={48} cy={28.4} r={1.5} />
      <circle {...node} cx={66} cy={38.3} r={1.5} />
    </>
  );
}

/** Memory tape: a row of addressable cells with a read/write head over one. */
function memory(): ReactNode {
  const cells = 7;
  const cw = 12;
  const x0 = 6;
  const cy = 42;
  const half = 7;
  const headIndex = 3;
  const headX = x0 + cw * headIndex + cw / 2;
  return (
    <>
      {Array.from({ length: cells }, (_, i) => {
        const cx = x0 + cw * i;
        return (
          <rect key={i} {...stroke} x={cx} y={cy - half} width={cw} height={half * 2} />
        );
      })}
      {/* controller and the head pointing into the active cell */}
      <rect {...stroke} x={headX - 8} y={9} width={16} height={11} rx={2} />
      <path {...stroke} d={`M${headX} 20 V${cy - half - 5}`} />
      <path {...stroke} d={`M${headX - 3.4} ${cy - half - 5} L${headX} ${cy - half - 1} L${headX + 3.4} ${cy - half - 5} Z`} />
    </>
  );
}

/** Convolution: a receptive field mapping a kernel window to a feature cell. */
function conv(): ReactNode {
  const x0 = 8;
  const y0 = 14;
  const g = 12;
  const n = 3;
  const fx = 78;
  const fy = 32;
  return (
    <>
      {/* input feature map */}
      {Array.from({ length: n }, (_, r) =>
        Array.from({ length: n }, (_, c) => (
          <rect key={`${r}-${c}`} {...stroke} x={x0 + c * g} y={y0 + r * g} width={g} height={g} opacity={0.5} />
        )),
      )}
      {/* highlighted 2x2 kernel window */}
      <rect {...stroke} x={x0} y={y0} width={g * 2} height={g * 2} strokeWidth={1.4} />
      {/* projection to a single output cell */}
      <path {...stroke} d={`M${x0 + g * 2} ${y0} L${fx} ${fy - 6}`} opacity={0.45} />
      <path {...stroke} d={`M${x0 + g * 2} ${y0 + g * 2} L${fx} ${fy + 6}`} opacity={0.45} />
      <rect {...stroke} x={fx} y={fy - 6} width={12} height={12} />
    </>
  );
}

/** Compression: many long codes funnel to a few short ones (description length). */
function compression(): ReactNode {
  const left = [10, 16, 22, 28, 34];
  const leftHeights = [34, 22, 40, 18, 30];
  const right = [70, 78, 86];
  const rightHeights = [14, 20, 10];
  const mid = 50;
  return (
    <>
      {left.map((x, i) => (
        <path key={x} {...stroke} d={`M${x} ${32 + leftHeights[i] / 2} V${32 - leftHeights[i] / 2}`} />
      ))}
      {/* funnel */}
      <path {...stroke} d={`M40 14 L${mid} 28 L40 50`} opacity={0.5} />
      <path {...stroke} d={`M${mid} 28 H62`} opacity={0.5} />
      <path {...stroke} d={`M60 25 l3.4 3 l-3.4 3`} opacity={0.7} />
      {right.map((x, i) => (
        <path key={x} {...stroke} d={`M${x} ${32 + rightHeights[i] / 2} V${32 - rightHeights[i] / 2}`} />
      ))}
    </>
  );
}

const FIGURES: Record<FigureKey, () => ReactNode> = {
  attention,
  residual,
  recurrence,
  graph,
  scaling,
  memory,
  conv,
  compression,
};

export default function LineFigure({
  figure,
  className,
  style,
  title,
}: {
  figure: FigureKey;
  className?: string;
  style?: CSSProperties;
  title?: string;
}) {
  const draw = FIGURES[figure];
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      className={className}
      style={style}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      {title ? <title>{title}</title> : null}
      {draw()}
    </svg>
  );
}
