import React, { useState, useEffect } from "react";
import { bindActionCreators, Dispatch } from "redux";
import { connect } from "react-redux";
import styled from "styled-components";
import ReactMapGL, { Source, Layer } from "react-map-gl";

import "mapbox-gl/dist/mapbox-gl.css";

import { JourneyState } from "../reducers/journeyReducer";
import { StoreState } from "../reducers/rootReducer";
import { ViewportState } from "../reducers/mapReducer";
import { updateViewport } from "../actions/map";
import { RouteType } from "../model/Journey";

const MAP_STYLE = "mapbox://styles/mapbox/outdoors-v11";

const SELECTED_ROUTE_COLOUR = "hsl(204, 86%, 53%)";
const UNSELECTED_ROUTE_COLOUR = "hsl(0, 0%, 48%)";

const MapContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const initialDimensions = {
  width: window.innerWidth,
  height: window.innerHeight
};

export interface MapProps {
  journey: JourneyState;
  viewport: ViewportState;
  selectedRoute: RouteType;
}

export interface MapDispatchProps {
  updateViewport: typeof updateViewport;
}

const Map: React.FunctionComponent<MapProps & MapDispatchProps> = ({
  journey: { journey },
  viewport,
  updateViewport,
  selectedRoute
}) => {
  const [dimensions, setDimensions] = useState(initialDimensions);

  const resizeHandler = () => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  const renderMapChildren = () => {
    if (!journey) return null;

    const children = [];

    const notSelectedRoutes = Object.keys(journey.routes).filter(
      routeType => routeType !== selectedRoute
    );

    for (const routeType of [...notSelectedRoutes, selectedRoute]) {
      children.push(
        <Source
          type="geojson"
          data={{
            type: "Feature",
            geometry: journey.routes[routeType as RouteType].geoJson,
            properties: {}
          }}
        >
          <Layer
            type="line"
            paint={{
              "line-color": "#ffffff",
              "line-width": 6
            }}
            layout={{
              "line-join": "round",
              "line-cap": "round"
            }}
          />
          <Layer
            type="line"
            paint={{
              "line-color":
                routeType === selectedRoute
                  ? SELECTED_ROUTE_COLOUR
                  : UNSELECTED_ROUTE_COLOUR,
              "line-width": 3
            }}
            layout={{
              "line-join": "round",
              "line-cap": "round"
            }}
          />
        </Source>
      );
    }

    return children;
  };

  return (
    <MapContainer>
      <ReactMapGL
        {...viewport}
        {...dimensions}
        mapStyle={baseMapStyle}
        onViewportChange={updateViewport}
      >
        {renderMapChildren()}
      </ReactMapGL>
    </MapContainer>
  );
};

const mapStateToProps = ({
  journey,
  map: { viewport, selectedRoute }
}: StoreState): MapProps => ({ journey, viewport, selectedRoute });

const mapDispatchToProps = (dispatch: Dispatch): MapDispatchProps =>
  bindActionCreators({ updateViewport }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Map);
