import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const geninfosAdapter = createEntityAdapter({});

const initialState = geninfosAdapter.getInitialState();

export const geninfosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeninfos: builder.query({
      query: () => ({
        url: "/geninfos",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedGeninfos = responseData.map((geninfo) => {
          geninfo.id = geninfo._id;
          return geninfo;
        });
        return geninfosAdapter.setAll(initialState, loadedGeninfos);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Geninfo", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Geninfo", id })),
          ];
        } else return [{ type: "Geninfo", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetGeninfosQuery } = geninfosApiSlice;

export const selectGeninfosResult =
  geninfosApiSlice.endpoints.getGeninfos.select();

const selectGeninfosData = createSelector(
  selectGeninfosResult,
  (geninfosResult) => geninfosResult.data
);

export const {
  selectAll: selectAllGeninfos,
  selectById: selectGeninfoById,
  selectIds: selectGeninfoIds,
  // Pass in a selector that returns the geninfos slice of state
} = geninfosAdapter.getSelectors(
  (state) => selectGeninfosData(state) ?? initialState
);
