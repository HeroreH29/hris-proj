import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const attendanceAdapter = createEntityAdapter({});
const casualRateAdapter = createEntityAdapter({});

const initialState = attendanceAdapter.getInitialState();
const casRateInitialState = casualRateAdapter.getInitialState();

export const attendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAttendanceData: builder.query({
      query: () => ({
        url: "/attendances",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedAttendance = responseData.map((attendance) => {
          attendance.id = attendance._id;
          return attendance;
        });
        return attendanceAdapter.setAll(initialState, loadedAttendance);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Attendance", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Attendance", id })),
          ];
        } else if (error) {
          return [{ type: "Attendance", id: "LIST" }];
        } else return [{ type: "Attendance", id: "LIST" }];
      },
    }),
    addNewAttendance: builder.mutation({
      query: (initialAttendance) => ({
        url: "/attendances",
        method: "POST",
        body: {
          ...initialAttendance,
        },
      }),
      invalidatesTags: [{ type: "Attendance", id: "LIST" }],
    }),
    updateAttendance: builder.mutation({
      query: (initialAttendance) => ({
        url: "/attendances",
        method: "PATCH",
        body: {
          ...initialAttendance,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Attendance", id: arg.id },
      ],
    }),
    deleteAttendance: builder.mutation({
      query: ({ id }) => ({
        url: "/attendances",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Attendance",
          id: arg.id,
        },
      ],
    }),
  }),
});

export const casualRateApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCasualRates: builder.query({
      query: () => ({
        url: "/casualrates",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedCasualRate = responseData.map((casualrate) => {
          casualrate.id = casualrate._id;
          return casualrate;
        });
        return attendanceAdapter.setAll(casRateInitialState, loadedCasualRate);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "CasualRate", id: "LIST" },
            ...result.ids.map((id) => ({ type: "CasualRate", id })),
          ];
        } else if (error) {
          return [{ type: "CasualRate", id: "LIST" }];
        } else return [{ type: "CasualRate", id: "LIST" }];
      },
    }),
    updateCasualRate: builder.mutation({
      query: (initialCasualRate) => ({
        url: "/casualrates",
        method: "PATCH",
        body: {
          ...initialCasualRate,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "CasualRate", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetAttendanceDataQuery,
  useAddNewAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceApiSlice;
export const { useGetCasualRatesQuery, useUpdateCasualRateMutation } =
  casualRateApiSlice;

// returns the query result object
export const selectAttendancesResult =
  attendanceApiSlice.endpoints.getAttendanceData.select();

export const selectCasualRatesResult =
  casualRateApiSlice.endpoints.getCasualRates.select();

// creates memoized selector
const selectAttendanceData = createSelector(
  selectAttendancesResult,
  (attendancesResult) => attendancesResult.data // normalized state object with ids & entities
);
const selectCasualRateData = createSelector(
  selectCasualRatesResult,
  (casualRatesResult) => casualRatesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllAttendances,
  selectById: selectAttendanceById,
  selectIds: selectAttendanceIds,
  // Pass in a selector that returns the announcements slice of state
} = attendanceAdapter.getSelectors(
  (state) => selectAttendanceData(state) ?? initialState
);

export const {
  selectAll: selectAllCasualRates,
  selectById: selectCasualRateById,
  selectIds: selectCasualRateIds,
  // Pass in a selector that returns the announcements slice of state
} = casualRateAdapter.getSelectors(
  (state) => selectCasualRateData(state) ?? casRateInitialState
);
