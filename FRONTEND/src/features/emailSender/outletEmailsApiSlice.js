import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const outletEmailsAdapter = createEntityAdapter({});

const outletEmailsInitialState = outletEmailsAdapter.getInitialState();

export const outletEmailsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOutletEmails: builder.query({
      query: () => ({
        url: "/outletemails",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedOutletEmails = responseData.map((email) => {
          email.id = email._id;
          return email;
        });
        return outletEmailsAdapter.setAll(
          outletEmailsInitialState,
          loadedOutletEmails
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "OutletEmail", id: "LIST" },
            ...result.ids.map((id) => ({ type: "OutletEmail", id })),
          ];
        } else return [{ type: "OutletEmail", id: "LIST" }];
      },
    }),

    // addNewLeave: builder.mutation({
    //   query: (initialLeaveData) => ({
    //     url: "/leaves",
    //     method: "POST",
    //     body: {
    //       ...initialLeaveData,
    //     },
    //   }),
    //   invalidatesTags: [
    //     {
    //       type: "Leave",
    //       id: "LIST",
    //     },
    //   ],
    // }),
    // updateLeave: builder.mutation({
    //   query: (initialLeaveData) => ({
    //     url: "/leaves",
    //     method: "PATCH",
    //     body: {
    //       ...initialLeaveData,
    //     },
    //   }),
    //   invalidatesTags: (result, error, arg) => [
    //     {
    //       type: "Leave",
    //       id: arg.id,
    //     },
    //   ],
    // }),
    // deleteLeave: builder.mutation({
    //   query: ({ id }) => ({
    //     url: "/leaves",
    //     method: "DELETE",
    //     body: { id },
    //   }),
    //   invalidatesTags: (result, error, arg) => [
    //     {
    //       type: "Leave",
    //       id: arg.id,
    //     },
    //   ],
    // }),
  }),
});

export const { useGetOutletEmailsQuery } = outletEmailsApiSlice;

export const selectOutletEmailsResult =
  outletEmailsApiSlice.endpoints.getOutletEmails.select();

const selectOutletEmailsData = createSelector(
  selectOutletEmailsResult,
  (outletEmailsResult) => outletEmailsResult.data
);

export const {
  selectAll: selectAllOutletEmails,
  selectById: selectOutletEmailById,
  selectIds: selectOutletEmailIds,
} = outletEmailsAdapter.getSelectors(
  (state) => selectOutletEmailsData(state) ?? outletEmailsInitialState
);
