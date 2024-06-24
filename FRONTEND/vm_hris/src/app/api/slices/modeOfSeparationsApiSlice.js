import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";

const modeOfSeparationAdapter = createEntityAdapter({});

const initialState = modeOfSeparationAdapter.getInitialState();

export const modeOfSeparationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllModeOfSeparations: builder.query({
      query: () => ({
        url: "/modeofseparations",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedModeOfSeparations = responseData.map((modeofseparation) => {
          modeofseparation.id = modeofseparation._id;
          return modeofseparation;
        });
        return modeOfSeparationAdapter.setAll(
          initialState,
          loadedModeOfSeparations
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Modeofseparation", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Modeofseparation", id })),
          ];
        } else if (error) {
          return [{ type: "Modeofseparation", id: "LIST" }];
        } else return [{ type: "Modeofseparation", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetAllModeOfSeparationsQuery } = modeOfSeparationApiSlice;

// returns the query result object
export const selectModeofseparationResult =
  modeOfSeparationApiSlice.endpoints.getAllModeOfSeparations.select();

// creates memoized selector
const selectModeofseparationData = createSelector(
  selectModeofseparationResult,
  (modeofseparationResult) => modeofseparationResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllModeofseparations,
  selectById: selectModeofseparationById,
  selectIds: selectModeofseparationIds,
  // Pass in a selector that returns the announcements slice of state
} = modeOfSeparationAdapter.getSelectors(
  (state) => selectModeofseparationData(state) ?? initialState
);
