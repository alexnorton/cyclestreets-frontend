import React from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import ReactMapGL, { Source, Layer, PointerEvent } from "react-map-gl";
import useResizeObserver from "use-resize-observer";

import "mapbox-gl/dist/mapbox-gl.css";

import { JourneyState } from "../reducers/journeyReducer";
import { StoreState } from "../reducers/rootReducer";
import { ViewportState } from "../reducers/mapReducer";
import { updateViewport, updateSelectedRoute } from "../actions/map";
import { RouteType } from "../model/Journey";

const MAP_STYLE = "mapbox://styles/mapbox/outdoors-v11";

const SELECTED_ROUTE_COLOUR = "hsl(204, 86%, 53%)";
const UNSELECTED_ROUTE_COLOUR = "hsl(0, 0%, 48%)";

const MapContainer = styled.div`
  height: 100%;
  width: 100%;
  flex-grow: 1;
`;

export interface MapProps {
  journey: JourneyState;
  viewport: ViewportState;
  selectedRoute: RouteType;
}

export interface MapDispatchProps {
  updateViewport: typeof updateViewport;
  updateSelectedRoute: typeof updateSelectedRoute;
}

const Map: React.FunctionComponent<MapProps & MapDispatchProps> = ({
  journey: { journey },
  viewport,
  updateViewport,
  updateSelectedRoute,
  selectedRoute
}) => {
  const { ref, width = 1, height = 1 } = useResizeObserver<HTMLDivElement>();

  const mapChildren: React.ReactNode[] = [];
  const interactiveLayerIds: string[] = [];

  if (journey) {
    ["unselectedRoutePlaceholder", "selectedRoutePlaceholder"].forEach(id => {
      mapChildren.push(
        <Layer
          key={id}
          id={id}
          type="background"
          layout={{ visibility: "none" }}
          paint={{}}
          beforeId="contour-label"
        />
      );
    });

    const notSelectedRoutes = Object.keys(journey.routes).filter(
      routeType => routeType !== selectedRoute
    );

    for (const routeType of [selectedRoute, ...notSelectedRoutes]) {
      interactiveLayerIds.push(routeType);

      const fillId = `${routeType}-fill`;

      const beforeId =
        routeType === selectedRoute
          ? "selectedRoutePlaceholder"
          : "unselectedRoutePlaceholder";

      mapChildren.push(
        <Source
          key={routeType}
          type="geojson"
          data={{
            type: "Feature",
            geometry: journey.routes[routeType as RouteType].geoJson,
            properties: {}
          }}
        >
          <Layer
            id={routeType}
            type="line"
            paint={{
              "line-width": 6,
              "line-color": "#ffffff"
            }}
            layout={{
              "line-join": "round",
              "line-cap": "round"
            }}
            beforeId={beforeId}
          />
          <Layer
            id={fillId}
            type="line"
            paint={{
              "line-width": 3,
              "line-color":
                routeType === selectedRoute
                  ? SELECTED_ROUTE_COLOUR
                  : UNSELECTED_ROUTE_COLOUR,
              "line-color-transition": {
                duration: 0
              }
            }}
            layout={{
              "line-join": "round",
              "line-cap": "round"
            }}
            beforeId={beforeId}
          />
        </Source>
      );
    }
  }

  const handleClick = ({ features }: PointerEvent) => {
    if (features.length === 0) return;

    const route = features[0].layer.id as RouteType;
    updateSelectedRoute(route);
  };

  return (
    <MapContainer ref={ref}>
      <ReactMapGL
        {...viewport}
        width={width}
        height={height}
        mapStyle={MAP_STYLE}
        onViewportChange={updateViewport}
        interactiveLayerIds={interactiveLayerIds}
        onNativeClick={handleClick}
      >
        {mapChildren}
      </ReactMapGL>
    </MapContainer>
  );
};

const mapStateToProps = ({
  journey,
  map: { viewport, selectedRoute }
}: StoreState): MapProps => ({ journey, viewport, selectedRoute });

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchProps =>
  bindActionCreators({ updateViewport, updateSelectedRoute }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Map);
