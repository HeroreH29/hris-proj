import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";
import { parse } from "date-fns";

const leavesAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    const dateA = parse(a.DateOfFilling, "MMM dd, yyyy", new Date());
    const dateB = parse(b.DateOfFilling, "MMM dd, yyyy", new Date());

    if (dateA.valueOf() > dateB.valueOf()) {
      return -1;
    } else if (dateA.valueOf() < dateB.valueOf()) {
      return 1;
    } else {
      return 0;
    }
  },
});
const leaveCreditsAdapter = createEntityAdapter({});

const leavesInitialState = leavesAdapter.getInitialState();
const leaveCreditsInitialState = leaveCreditsAdapter.getInitialState();

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
        return leavesAdapter.setAll(leavesInitialState, loadedLeaves);
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

export const leaveCreditsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveCredits: builder.query({
      query: () => ({
        url: "/leavecredits",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedLeaveCredits = responseData.map((leavecredit) => {
          leavecredit.id = leavecredit._id;
          return leavecredit;
        });
        return leaveCreditsAdapter.setAll(
          leaveCreditsInitialState,
          loadedLeaveCredits
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "LeaveCredit", id: "LIST" },
            ...result.ids.map((id) => ({ type: "LeaveCredit", id })),
          ];
        } else return [{ type: "LeaveCredit", id: "LIST" }];
      },
    }),
    addNewLeaveCredit: builder.mutation({
      query: (initialLeaveCreditData) => ({
        url: "/leavecredits",
        method: "POST",
        body: {
          ...initialLeaveCreditData,
        },
      }),
      invalidatesTags: [
        {
          type: "LeaveCredit",
          id: "LIST",
        },
      ],
    }),
    updateLeaveCredit: builder.mutation({
      query: (initialLeaveCreditData) => ({
        url: "/leavecredits",
        method: "PATCH",
        body: {
          ...initialLeaveCreditData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "LeaveCredit",
          id: arg.id,
        },
      ],
    }),
    deleteLeaveCredit: builder.mutation({
      query: ({ id }) => ({
        url: "/leavecredits",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "LeaveCredit",
          id: arg.id,
        },
      ],
    }),
  }),
});

// extra api slice for sending leave thru email
export const sendLeaveEmailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendLeaveThruEmail: builder.mutation({
      query: (initialEmailData) => ({
        url: "/emailsender",
        method: "POST",
        body: {
          ...initialEmailData,
        },
      }),
    }),
  }),
});

export const { useSendLeaveThruEmailMutation } = sendLeaveEmailApiSlice;

export const {
  useGetLeavesQuery,
  useAddNewLeaveMutation,
  useUpdateLeaveMutation,
  useDeleteLeaveMutation,
} = leavesApiSlice;

export const {
  useGetLeaveCreditsQuery,
  useAddNewLeaveCreditMutation,
  useUpdateLeaveCreditMutation,
  useDeleteLeaveCreditMutation,
} = leaveCreditsApiSlice;

// returns the query result object
export const selectLeavesResult = leavesApiSlice.endpoints.getLeaves.select();

export const selectLeaveCreditsResult =
  leaveCreditsApiSlice.endpoints.getLeaveCredits.select();

// creates memoized selector
const selectLeavesData = createSelector(
  selectLeavesResult,
  (leavesResult) => leavesResult.data // normalized state object with ids & entities
);

const selectLeaveCreditsData = createSelector(
  selectLeaveCreditsResult,
  (leaveCreditsResult) => leaveCreditsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllLeaves,
  selectById: selectLeaveById,
  selectIds: selectLeaveIds,
  // Pass in a selector that returns the leaves slice of state
} = leavesAdapter.getSelectors(
  (state) => selectLeavesData(state) ?? leavesInitialState
);

export const {
  selectAll: selectAllLeaveCredits,
  selectById: selectLeaveCreditById,
  selectIds: selectLeaveCreditIds,
  // Pass in a selector that returns the leaves slice of state
} = leaveCreditsAdapter.getSelectors(
  (state) => selectLeaveCreditsData(state) ?? leaveCreditsInitialState
);
