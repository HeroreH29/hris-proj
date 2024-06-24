import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";

const outletAdapter = createEntityAdapter({});

const initialState = outletAdapter.getInitialState();

export const outletApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllOutlets: builder.query({
      query: () => ({
        url: "/outlets",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedOutlet = responseData.map((outlet) => {
          outlet.id = outlet._id;
          return outlet;
        });
        return outletAdapter.setAll(initialState, loadedOutlet);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Outlet", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Outlet", id })),
          ];
        } else if (error) {
          return [{ type: "Outlet", id: "LIST" }];
        } else return [{ type: "Outlet", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetAllOutletsQuery } = outletApiSlice;

// returns the query result object
export const selectOutletResult =
  outletApiSlice.endpoints.getAllOutlets.select();

// creates memoized selector
const selectOutletData = createSelector(
  selectOutletResult,
  (outletResult) => outletResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllOutlets,
  selectById: selectOutletById,
  selectIds: selectOutletIds,
  // Pass in a selector that returns the announcements slice of state
} = outletAdapter.getSelectors(
  (state) => selectOutletData(state) ?? initialState
);
