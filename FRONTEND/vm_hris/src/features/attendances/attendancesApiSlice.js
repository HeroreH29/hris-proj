import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const attendanceAdapter = createEntityAdapter({});

const initialState = attendanceAdapter.getInitialState();

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

export const {
  useGetAttendanceDataQuery,
  useAddNewAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
} = attendanceApiSlice;

// returns the query result object
export const selectAttendancesResult =
  attendanceApiSlice.endpoints.getAttendanceData.select();

// creates memoized selector
const selectAttendanceData = createSelector(
  selectAttendancesResult,
  (attendancesResult) => attendancesResult.data // normalized state object with ids & entities
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
