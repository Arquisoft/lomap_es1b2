import { createContext } from 'react';
import { Dispatch, useReducer } from "react";
import { IPMarker } from "../shared/SharedTypes";

export enum Types {
    ADD_MARKER = 'ADD_MARKER',
    SET_MARKERS = 'SET_MARKERS',
    DELETE_MARKER = 'DELETE_MARKER',
    UPDATE_MARKER = 'UPDATE_MARKER'
}

type MarkerActions = {
    type: Types.ADD_MARKER;
    payload: {
        marker: IPMarker;
    };
} | {
    type: Types.SET_MARKERS;
    payload: {
        markers: IPMarker[];
    }
} | {
    type: Types.DELETE_MARKER;
    payload: {
        id: string;
    };
} | {
    type: Types.UPDATE_MARKER;
    payload: {
        id: string, marker: IPMarker;
    };
}

export const MarkerContext = createContext<{ state: IPMarker[], dispatch: Dispatch<MarkerActions> }>({ state: [], dispatch: () => null })

export const markerReducer = (state: IPMarker[], action: MarkerActions): IPMarker[] => {
    switch (action.type) {
        case Types.SET_MARKERS:
            return action.payload.markers
        case Types.ADD_MARKER:
            return [action.payload.marker, ...state]
        case Types.DELETE_MARKER:
            return state.filter(m => m.id !== action.payload.id)
        case Types.UPDATE_MARKER:
            let markers = state.filter(m => m.id !== action.payload.id)
            return [action.payload.marker, ...markers]
        default:
            return state
    }
}

export const MarkerContextProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(markerReducer, []);

    return (
        <MarkerContext.Provider value={{ state, dispatch }}>
            {children}
        </MarkerContext.Provider>
    )
}