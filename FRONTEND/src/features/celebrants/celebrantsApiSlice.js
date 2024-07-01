import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const celebrantsAdapter = createEntityAdapter({});

const celebrantsInitialState = celebrantsAdapter.getInitialState();

export const celebrantsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCelebrants: builder.query({
      query: () => ({
        url: "/celebrants",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
    }),
  }),
});

export const { useGetCelebrantsQuery } = celebrantsApiSlice;

export const selectCelebrantsResult =
  celebrantsApiSlice.endpoints.getCelebrants.select();

const selectCelebrantData = createSelector(
  selectCelebrantsResult,
  (celebrantResult) => celebrantResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllCelebrants,
  selectById: selectCelebrantById,
  selectIds: selectCelebrantIds,
  // Pass in a selector that returns the personalinfos slice of state
} = celebrantsAdapter.getSelectors(
  (state) => selectCelebrantData(state) ?? celebrantsInitialState
);
