import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import type { IndiaFeatureCollection, StateFeature } from '../types/geo';
import type { DistrictFeatureCollection } from '../hooks/useGeoData';
import type { DataStore } from '../types/data';
import { Tooltip } from './Tooltip';

interface IndiaMapProps {
  geoData: IndiaFeatureCollection;
  districtData: DistrictFeatureCollection | null;
  populationStore: DataStore | null;
  enrolmentStore: DataStore | null;
  onStateClick?: (stateName: string) => void;
}

const MAP_WIDTH = 700;
const MAP_HEIGHT = 800;

export function IndiaMap({ geoData, districtData, populationStore, enrolmentStore, onStateClick }: IndiaMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<{
    stateName: string;
    x: number;
    y: number;
  } | null>(null);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);

  const projectionRef = useRef<d3.GeoProjection | null>(null);

  useEffect(() => {
    if (!svgRef.current || !geoData) return;

    const svg = d3.select(svgRef.current);

    // Create projection fitted to the data
    const projection = d3
      .geoMercator()
      .fitSize([MAP_WIDTH, MAP_HEIGHT], geoData);

    projectionRef.current = projection;

    const pathGen = d3.geoPath().projection(projection);

    // Clear previous layers
    svg.select('g.districts').remove();
    svg.select('g.states').remove();

    // Render district boundaries first (behind states)
    if (districtData) {
      const dg = svg.append('g').attr('class', 'districts');
      dg.selectAll('path')
        .data(districtData.features)
        .join('path')
        .attr('d', (d) => pathGen(d) ?? '')
        .attr('class', 'district-path');
    }

    // Render state boundaries on top
    const g = svg.append('g').attr('class', 'states');

    g.selectAll<SVGPathElement, StateFeature>('path')
      .data(geoData.features)
      .join('path')
      .attr('d', (d) => pathGen(d) ?? '')
      .attr('class', 'state-path')
      .attr('data-state', (d) => d.properties.st_nm)
      .attr('tabindex', 0)
      .attr('role', 'button')
      .attr('aria-label', (d) => d.properties.st_nm)
      .on('mouseenter', function (event: MouseEvent, d: StateFeature) {
        d3.select(this).classed('state-hover', true);
        setTooltip({
          stateName: d.properties.st_nm,
          x: event.clientX,
          y: event.clientY,
        });
      })
      .on('mousemove', function (event: MouseEvent, d: StateFeature) {
        setTooltip({
          stateName: d.properties.st_nm,
          x: event.clientX,
          y: event.clientY,
        });
      })
      .on('mouseleave', function () {
        d3.select(this).classed('state-hover', false);
        setTooltip(null);
      })
      .on('click', function (_event: MouseEvent, d: StateFeature) {
        const name = d.properties.st_nm;
        console.log(`[click] ${name}`);
        onStateClick?.(name);
      });
  }, [geoData, districtData, onStateClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!geoData) return;
      const count = geoData.features.length;

      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev + 1) % count;
          focusPath(next);
          return next;
        });
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = (prev - 1 + count) % count;
          focusPath(next);
          return next;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < count) {
          const name = geoData.features[focusedIndex].properties.st_nm;
          console.log(`[keyboard-select] ${name}`);
          onStateClick?.(name);
        }
      }
    },
    [geoData, focusedIndex, onStateClick],
  );

  function focusPath(index: number) {
    if (!svgRef.current) return;
    const paths = svgRef.current.querySelectorAll<SVGPathElement>('path.state-path');
    paths[index]?.focus();
  }

  return (
    <div className="map-container" style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
        width={MAP_WIDTH}
        height={MAP_HEIGHT}
        onKeyDown={handleKeyDown}
        aria-label="Map of India showing states and union territories"
        role="img"
      />
      {tooltip && (
        <Tooltip
          stateName={tooltip.stateName}
          x={tooltip.x}
          y={tooltip.y}
          populationStore={populationStore}
          enrolmentStore={enrolmentStore}
        />
      )}
    </div>
  );
}
