import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson';

export interface StateProperties {
  st_nm: string;
}

export type StateFeature = Feature<Polygon | MultiPolygon, StateProperties>;
export type IndiaFeatureCollection = FeatureCollection<Polygon | MultiPolygon, StateProperties>;
