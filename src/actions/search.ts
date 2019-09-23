import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { StoreState } from "../reducers/rootReducer";
import { geocode as geocodeFromApi } from "../api";
import { GeocodeResponse } from "../model/CycleStreets";

export const GEOCODE_REQUEST = "GEOCODE_REQUEST";
interface GeocodeRequest {
  type: typeof GEOCODE_REQUEST;
  query: string;
  waypointId: string;
}
export const geocodeRequest = (
  query: string,
  waypointId: string
): GeocodeRequest => ({
  type: GEOCODE_REQUEST,
  query,
  waypointId
});

export const GEOCODE_SUCCESS = "GEOCODE_SUCCESS";
interface GeocodeSuccess {
  type: typeof GEOCODE_SUCCESS;
  query: string;
  waypointId: string;
  result: GeocodeResponse;
}
export const geocodeSuccess = (
  query: string,
  waypointId: string,
  result: GeocodeResponse
): GeocodeSuccess => ({
  type: GEOCODE_SUCCESS,
  query,
  waypointId,
  result
});

export const geocode = (
  query: string,
  waypointId: string
): ThunkAction<void, StoreState, null, Action<string>> => async dispatch => {
  dispatch(geocodeRequest(query, waypointId));

  if (query.length <= 1) return;

  const geocodeResponse = await geocodeFromApi(query);

  dispatch(geocodeSuccess(query, waypointId, geocodeResponse));
};

export type SearchAction = GeocodeRequest | GeocodeSuccess;
