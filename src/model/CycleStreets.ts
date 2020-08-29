import { FeatureCollection, Point } from "geojson";

export type PlanType = "balanced" | "fastest" | "quietest";

interface RouteMarker {
  "@attributes": {
    type: "route";
    start: string;
    start_latitude: string;
    start_longitude: string;
    finish: string;
    finish_latitude: string;
    finish_longitude: string;
    event: string;
    whence: string;
    speed: string;
    itinerary: string;
    plan: PlanType;
    note: string;
    length: string;
    time: string;
    busynance: string;
    quietness: string;
    walk: string;
    west: string;
    south: string;
    east: string;
    north: string;
    signalledJunctions: string;
    signalledCrossings: string;
    turn: string;
    coordinates: string;
    elevations: string;
    distances: string;
    grammesCO2saved: string;
    calories: string;
    edition: string;
  };
}

interface SegmentMarker {
  "@attributes": {
    type: "segment";
    name: string;
    legNumber: string;
    distance: string;
    time: string;
    busynance: string;
    walk: string;
    signalledJunctions: string;
    signalledCrossings: string;
    turn: string;
    startBearing: string;
    color: string;
    points: string;
    distances: string;
    elevations: string;
    provisionName: string;
  };
}

interface Waypoint {
  "@attributes": {
    sequenceId: string;
    latitude: string;
    longitude: string;
  };
}

export interface JourneyResponse {
  marker: [RouteMarker, ...SegmentMarker[]];
  waypoint: Waypoint[];
}

export type GeocodeResponse = FeatureCollection<
  Point,
  {
    bbox: string;
    name: string;
    near: string;
  }
>;
