import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const geninfosAdapter = createEntityAdapter({});
const personalinfosAdapter = createEntityAdapter({});

const genInitialState = geninfosAdapter.getInitialState();
const personalInitialState = personalinfosAdapter.getInitialState();

// General infos
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
        return geninfosAdapter.setAll(genInitialState, loadedGeninfos);
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
    addGeninfo: builder.mutation({
      query: (initialGeninfo) => ({
        url: "/geninfos",
        method: "POST",
        body: {
          ...initialGeninfo,
        },
      }),
      invalidatesTags: [
        {
          type: "Geninfo",
          id: "LIST",
        },
      ],
    }),
    updateGeninfo: builder.mutation({
      query: (initialGeninfo) => ({
        url: "/geninfos",
        method: "PATCH",
        body: {
          ...initialGeninfo,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Geninfo",
          id: arg.id,
        },
      ],
    }),
  }),
});

// Personal infos
export const personalinfosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalinfos: builder.query({
      query: () => ({
        url: "/personalinfos",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedPersonalinfos = responseData.map((personalinfo) => {
          personalinfo.id = personalinfo._id;
          return personalinfo;
        });
        return personalinfosAdapter.setAll(
          genInitialState,
          loadedPersonalinfos
        );
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
    addPersonalinfo: builder.mutation({
      query: (initialPersonalinfo) => ({
        url: "/personalinfos",
        method: "POST",
        body: {
          ...initialPersonalinfo,
        },
      }),
      invalidatesTags: [
        {
          type: "Personalinfo",
          id: "LIST",
        },
      ],
    }),
    updatePersonalinfo: builder.mutation({
      query: (initialPersonalinfo) => ({
        url: "/personalinfos",
        method: "PATCH",
        body: {
          ...initialPersonalinfo,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Personalinfo",
          id: arg.id,
        },
      ],
    }),
  }),
});

export const {
  useGetGeninfosQuery,
  useAddGeninfoMutation,
  useUpdateGeninfoMutation,
} = geninfosApiSlice;

export const {
  useGetPersonalinfosQuery,
  useAddPersonalinfoMutation,
  useUpdatePersonalinfoMutation,
} = personalinfosApiSlice;

export const selectGeninfosResult =
  geninfosApiSlice.endpoints.getGeninfos.select();

export const selectPersonalinfosResult =
  personalinfosApiSlice.endpoints.getPersonalinfos.select();

const selectGeninfosData = createSelector(
  selectGeninfosResult,
  (geninfosResult) => geninfosResult.data
);

const selectPersonalinfosData = createSelector(
  selectPersonalinfosResult,
  (personalinfosResult) => personalinfosResult.data
);

export const {
  selectAll: selectAllGeninfos,
  selectById: selectGeninfoById,
  selectIds: selectGeninfoIds,
  // Pass in a selector that returns the geninfos slice of state
} = geninfosAdapter.getSelectors(
  (state) => selectGeninfosData(state) ?? genInitialState
);

export const {
  selectAll: selectAllPersonalinfos,
  selectById: selectPersonalinfoById,
  selectIds: selectPersonalinfoIds,
  // Pass in a selector that returns the geninfos slice of state
} = personalinfosAdapter.getSelectors(
  (state) => selectPersonalinfosData(state) ?? personalInitialState
);
