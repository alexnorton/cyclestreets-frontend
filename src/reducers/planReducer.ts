import uuid from "uuid/v4";

import {
  PlanAction,
  UPDATE_WAYPOINT_INPUT_VALUE,
  GEOCODE_REQUEST,
  GEOCODE_SUCCESS,
  UPDATE_WAYPOINT_SELECTION
} from "../actions/plan";
import { JourneyAction, JOURNEY_SUCCESS } from "../actions/journey";
import { Waypoint } from "../model/Waypoint";

export interface PlanState {
  waypoints: Waypoint[];
}

const getWaypoint = (): Waypoint => ({
  id: uuid(),
  inputValue: "",
  selection: null,
  optionsQuery: null,
  options: []
});

const initialSearchState: PlanState = {
  waypoints: Array.from({ length: 2 }).map(getWaypoint)
};

const getWaypointIndex = (state: PlanState, id: string) =>
  state.waypoints.findIndex(({ id: stateId }) => stateId === id);

const planReducer = (
  state: PlanState = initialSearchState,
  action: PlanAction | JourneyAction
): PlanState => {
  let waypointIndex;

  switch (action.type) {
    case UPDATE_WAYPOINT_INPUT_VALUE:
      waypointIndex = getWaypointIndex(state, action.waypointId);
      return {
        ...state,
        waypoints: [
          ...state.waypoints.slice(0, waypointIndex),
          {
            ...state.waypoints[waypointIndex],
            inputValue: action.value,
            selection: null
          },
          ...state.waypoints.slice(waypointIndex + 1)
        ]
      };
    case GEOCODE_REQUEST:
      waypointIndex = getWaypointIndex(state, action.waypointId);
      return {
        ...state,
        waypoints: [
          ...state.waypoints.slice(0, waypointIndex),
          {
            ...state.waypoints[waypointIndex],
            optionsQuery: action.query
          },
          ...state.waypoints.slice(waypointIndex + 1)
        ]
      };
    case GEOCODE_SUCCESS:
      waypointIndex = getWaypointIndex(state, action.waypointId);
      return {
        ...state,
        waypoints: [
          ...state.waypoints.slice(0, waypointIndex),
          {
            ...state.waypoints[waypointIndex],
            options:
              action.query === state.waypoints[waypointIndex].optionsQuery
                ? action.result.features.map(
                    ({
                      properties: { name, near },
                      geometry: {
                        coordinates: [longitude, latitude]
                      }
                    }) => ({
                      name,
                      near,
                      latitude,
                      longitude,
                      id: uuid()
                    })
                  )
                : state.waypoints[waypointIndex].options
          },
          ...state.waypoints.slice(waypointIndex + 1)
        ]
      };
    case UPDATE_WAYPOINT_SELECTION:
      waypointIndex = getWaypointIndex(state, action.waypointId);
      return {
        ...state,
        waypoints: [
          ...state.waypoints.slice(0, waypointIndex),
          {
            ...state.waypoints[waypointIndex],
            selection: action.selection
          },
          ...state.waypoints.slice(waypointIndex + 1)
        ]
      };
    case JOURNEY_SUCCESS:
      return { waypoints: action.journey.waypoints };
    default:
      return state;
  }
};

export default planReducer;
