import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";

const employeeInfoAdapter = createEntityAdapter({});

const initialState = employeeInfoAdapter.getInitialState();

export const employeeInfoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllEmployeeInfos: builder.query({
      query: () => ({
        url: "/employeeinfos",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedEmployeeInfo = responseData.map((employeeInfo) => {
          employeeInfo.id = employeeInfo._id;
          return employeeInfo;
        });
        return employeeInfoAdapter.setAll(initialState, loadedEmployeeInfo);
      },
    }),
    createEmployeeInfo: builder.mutation({
      query: (initialEmployeeInfo) => ({
        url: "/employeeinfos",
        method: "POST",
        body: {
          ...initialEmployeeInfo,
        },
      }),
    }),
    updateEmployeeInfo: builder.mutation({
      query: (initialEmployeeInfo) => ({
        url: "/traininghistories",
        method: "PATCH",
        body: {
          ...initialEmployeeInfo,
        },
      }),
    }),
  }),
});

export const {
  useGetAllEmployeeInfosQuery,
  useCreateEmployeeInfoMutation,
  useUpdateEmployeeInfoMutation,
} = employeeInfoApiSlice;

export const selectEmployeeInfosResult =
  employeeInfoApiSlice.endpoints.getAllEmployeeInfos.select();

const selectEmployeeInfosData = createSelector(
  selectEmployeeInfosResult,
  (employeeinfosresult) => employeeinfosresult.data
);

export const {
  selectAll: selectAllEmployeeInfos,
  selectById: selectEmployeeInfoById,
  selectIds: selectEmployeeInfoIds,
} = employeeInfoAdapter.getSelectors(
  (state) => selectEmployeeInfosData(state) ?? initialState
);
