import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";

const empTypeAdapter = createEntityAdapter({});

const initialState = empTypeAdapter.getInitialState();

export const empTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmpTypes: builder.query({
      query: () => ({
        url: "/emptypes",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedEmpType = responseData.map((emptype) => {
          emptype.id = emptype._id;
          return emptype;
        });
        return empTypeAdapter.setAll(initialState, loadedEmpType);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Emptype", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Emptype", id })),
          ];
        } else if (error) {
          return [{ type: "Emptype", id: "LIST" }];
        } else return [{ type: "Emptype", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetAllEmpTypesQuery } = empTypeApiSlice;

// returns the query result object
export const selectEmptypeResult =
  empTypeApiSlice.endpoints.getAllEmpTypes.select();

// creates memoized selector
const selectEmptypeData = createSelector(
  selectEmptypeResult,
  (emptypeResult) => emptypeResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllEmptypes,
  selectById: selectEmptypeById,
  selectIds: selectEmptypeIds,
  // Pass in a selector that returns the announcements slice of state
} = empTypeAdapter.getSelectors(
  (state) => selectEmptypeData(state) ?? initialState
);
