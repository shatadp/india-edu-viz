import { useRef, useEffect, useId } from 'react';
import * as d3 from 'd3';
import type { CategoryBand, ProjectedFeature } from '../utils/tankGeometry';

interface TankFillVisualProps {
  projected: ProjectedFeature;
  bands: CategoryBand[];
  width: number;
  height: number;
  stateName: string;
}

const ANIM_DURATION = 800;

export function TankFillVisual({
  projected,
  bands,
  width,
  height,
  stateName,
}: TankFillVisualProps) {
  const clipId = useId().replace(/:/g, '_') + '_tank';
  const fillGroupRef = useRef<SVGGElement>(null);
  const prevBandsRef = useRef<string>('');

  // Animate bands whenever they change
  useEffect(() => {
    const g = fillGroupRef.current;
    if (!g) return;

    const sel = d3.select(g);

    // Determine if bands actually changed (avoid re-animating on unrelated renders)
    const bandsKey = bands.map((b) => `${b.slug}:${b.value}`).join('|') + stateName;
    const shouldAnimate = bandsKey !== prevBandsRef.current;
    prevBandsRef.current = bandsKey;

    // Join rects to bands by slug
    const rects = sel
      .selectAll<SVGRectElement, CategoryBand>('rect')
      .data(bands, (d) => d.slug);

    // Remove old bands
    rects.exit().remove();

    // Enter new bands
    const entered = rects
      .enter()
      .append('rect')
      .attr('x', 0)
      .attr('width', width)
      .attr('fill', (d) => d.color);

    // Merge enter + update
    const merged = entered.merge(rects);

    if (shouldAnimate) {
      // Start from bottom (y = shape bottom, height = 0) and animate up
      merged
        .attr('y', projected.bounds.y + projected.bounds.height)
        .attr('height', 0)
        .attr('fill', (d) => d.color)
        .transition()
        .duration(ANIM_DURATION)
        .ease(d3.easeCubicOut)
        .attr('y', (d) => d.y)
        .attr('height', (d) => d.height);
    } else {
      merged
        .attr('y', (d) => d.y)
        .attr('height', (d) => d.height)
        .attr('fill', (d) => d.color);
    }
  }, [bands, projected, width, stateName]);

  return (
    <svg
      className="tank-svg"
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      aria-label={`Tank fill visualization for ${stateName}`}
      role="img"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={projected.pathD} />
        </clipPath>
      </defs>

      {/* State outline (subtle) */}
      <path
        d={projected.pathD}
        fill="none"
        stroke="#ccc"
        strokeWidth={1.5}
      />

      {/* Clipped fill group */}
      <g clipPath={`url(#${clipId})`} ref={fillGroupRef} />

      {/* State outline on top for crisp edges */}
      <path
        d={projected.pathD}
        fill="none"
        stroke="#666"
        strokeWidth={1}
      />
    </svg>
  );
}
