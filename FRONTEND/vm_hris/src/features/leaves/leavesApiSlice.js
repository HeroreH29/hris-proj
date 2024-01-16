import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const leavesAdapter = createEntityAdapter({});

const initialState = leavesAdapter.getInitialState();

export const leavesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaves: builder.query({
      query: () => ({
        url: "/leaves",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedLeaves = responseData.map((leave) => {
          leave.id = leave._id;
          return leave;
        });
        return leavesAdapter.setAll(initialState, loadedLeaves);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Leave", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Leave", id })),
          ];
        } else return [{ type: "Leave", id: "LIST" }];
      },
    }),
    addNewLeave: builder.mutation({
      query: (initialLeaveData) => ({
        url: "/leaves",
        method: "POST",
        body: {
          ...initialLeaveData,
        },
      }),
      invalidatesTags: [
        {
          type: "Leave",
          id: "LIST",
        },
      ],
    }),
    updateLeave: builder.mutation({
      query: (initialLeaveData) => ({
        url: "/leaves",
        method: "PATCH",
        body: {
          ...initialLeaveData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Leave",
          id: arg.id,
        },
      ],
    }),
    deleteLeave: builder.mutation({
      query: ({ id }) => ({
        url: "/leaves",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Leave",
          id: arg.id,
        },
      ],
    }),
  }),
});

export const {
  useGetLeavesQuery,
  useAddNewLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} = leavesApiSlice;

// returns the query result object
export const selectLeavesResult = leavesApiSlice.endpoints.getLeaves.select();

// creates memoized selector
const selectLeavesData = createSelector(
  selectLeavesResult,
  (leavesResult) => leavesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllLeaves,
  selectById: selectLeaveById,
  selectIds: selectLeaveIds,
  // Pass in a selector that returns the leaves slice of state
} = leavesAdapter.getSelectors(
  (state) => selectLeavesData(state) ?? initialState
);
