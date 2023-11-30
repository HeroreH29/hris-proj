import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const personalinfosAdapter = createEntityAdapter({});

const initialState = personalinfosAdapter.getInitialState();

export const personalinfosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalinfos: builder.query({
      query: () => "/personalinfos",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedPersonalinfos = responseData.map((personalinfo) => {
          personalinfo.id = personalinfo._id;
          return personalinfo;
        });
        return personalinfosAdapter.setAll(initialState, loadedPersonalinfos);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Personalinfo", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Personalinfo", id })),
          ];
        } else return [{ type: "Personalinfo", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetPersonalinfosQuery } = personalinfosApiSlice;

// returns the query result object
export const selectPersonalinfosResult =
  personalinfosApiSlice.endpoints.getPersonalinfos.select();

// creates memoized selector
const selectPersonalinfosData = createSelector(
  selectPersonalinfosResult,
  (personalinfosResult) => personalinfosResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPersonalinfos,
  selectById: selectPersonalinfoById,
  selectIds: selectPersonalinfoIds,
  // Pass in a selector that returns the personalinfos slice of state
} = personalinfosAdapter.getSelectors(
  (state) => selectPersonalinfosData(state) ?? initialState
);
