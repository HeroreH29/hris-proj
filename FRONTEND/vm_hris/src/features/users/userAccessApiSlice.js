import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const userAccessesAdapter = createEntityAdapter({});

const initialState = userAccessesAdapter.getInitialState();

export const userAccessesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserAccesses: builder.query({
      query: () => ({
        url: "/useraccess",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedUserAccesses = responseData.map((useraccess) => {
          useraccess.id = useraccess._id;
          return useraccess;
        });
        return userAccessesAdapter.setAll(initialState, loadedUserAccesses);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "UserAccess", id: "LIST" },
            ...result.ids.map((id) => ({ type: "UserAccess", id })),
          ];
        } else return [{ type: "UserAccess", id: "LIST" }];
      },
    }),
    updateUserAccess: builder.mutation({
      query: (initalUserAccessData) => ({
        url: "/useraccess",
        method: "PATCH",
        body: {
          ...initalUserAccessData,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "UserAccess",
          id: arg.id,
        },
      ],
    }),
  }),
});

export const {
  useGetUserAccessesQuery,

  useUpdateUserAccessMutation,
} = userAccessesApiSlice;

// returns the query result object
export const selectUserAccessesResult =
  userAccessesApiSlice.endpoints.getUserAccesses.select();

// creates memoized selector
const selectUserAccessesData = createSelector(
  selectUserAccessesResult,
  (userAccessesResult) => userAccessesResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllUserAccesses,
  selectById: selectUserAccessById,
  selectIds: selectUserAccessIds,
  // Pass in a selector that returns the users slice of state
} = userAccessesAdapter.getSelectors(
  (state) => selectUserAccessesData(state) ?? initialState
);
