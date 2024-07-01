import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../apiSlice";

const departmentAdapter = createEntityAdapter({});

const initialState = departmentAdapter.getInitialState();

export const departmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDepartments: builder.query({
      query: () => ({
        url: "/departments",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedDepartment = responseData.map((department) => {
          department.id = department._id;
          return department;
        });
        return departmentAdapter.setAll(initialState, loadedDepartment);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Department", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Department", id })),
          ];
        } else if (error) {
          return [{ type: "Department", id: "LIST" }];
        } else return [{ type: "Department", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetAllDepartmentsQuery } = departmentApiSlice;

// returns the query result object
export const selectDepartmentResult =
  departmentApiSlice.endpoints.getAllDepartments.select();

// creates memoized selector
const selectDepartmentData = createSelector(
  selectDepartmentResult,
  (departmentResult) => departmentResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllDepartments,
  selectById: selectDepartmentById,
  selectIds: selectDepartmentIds,
  // Pass in a selector that returns the announcements slice of state
} = departmentAdapter.getSelectors(
  (state) => selectDepartmentData(state) ?? initialState
);
