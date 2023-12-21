import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const geninfosAdapter = createEntityAdapter({});
const personalinfosAdapter = createEntityAdapter({});
const dependentsAdapter = createEntityAdapter({});
const workinfosAdapter = createEntityAdapter({});
const educinfosAdapter = createEntityAdapter({});

const genInitialState = geninfosAdapter.getInitialState();
const personalInitialState = personalinfosAdapter.getInitialState();
const depInitialState = dependentsAdapter.getInitialState();
const workInitialState = workinfosAdapter.getInitialState();
const educInitialState = educinfosAdapter.getInitialState();

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

// Dependents
export const dependentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDependents: builder.query({
      query: () => ({
        url: "/dependents",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedDependents = responseData.map((dependent) => {
          dependent.id = dependent._id;
          return dependent;
        });
        return dependentsAdapter.setAll(depInitialState, loadedDependents);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Dependents", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Dependents", id })),
          ];
        } else return [{ type: "Dependents", id: "LIST" }];
      },
    }),
    addDependent: builder.mutation({
      query: (initialDependent) => ({
        url: "/dependents",
        method: "POST",
        body: {
          ...initialDependent,
        },
      }),
      invalidatesTags: [
        {
          type: "Dependent",
          id: "LIST",
        },
      ],
    }),
    updateDependent: builder.mutation({
      query: (initialDependent) => ({
        url: "/dependents",
        method: "PATCH",
        body: {
          ...initialDependent,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Dependent",
          id: arg.id,
        },
      ],
    }),
    deleteDependent: builder.mutation({
      query: ({ id }) => ({
        url: "/dependents",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Dependent",
          id: arg.id,
        },
      ],
    }),
  }),
});

// Work infos
export const workinfosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWorkinfos: builder.query({
      query: () => ({
        url: "/workinfos",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedWorkinfos = responseData.map((workinfo) => {
          workinfo.id = workinfo._id;
          return workinfo;
        });
        return workinfosAdapter.setAll(workInitialState, loadedWorkinfos);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Workinfos", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Workinfos", id })),
          ];
        } else return [{ type: "Workinfos", id: "LIST" }];
      },
    }),
    addWorkinfo: builder.mutation({
      query: (initialWorkinfo) => ({
        url: "/workinfos",
        method: "POST",
        body: {
          ...initialWorkinfo,
        },
      }),
      invalidatesTags: [
        {
          type: "Workinfo",
          id: "LIST",
        },
      ],
    }),
    updateWorkinfo: builder.mutation({
      query: (initialWorkinfo) => ({
        url: "/workinfos",
        method: "PATCH",
        body: {
          ...initialWorkinfo,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Workinfo",
          id: arg.id,
        },
      ],
    }),
    deleteWorkinfo: builder.mutation({
      query: ({ id }) => ({
        url: "/workinfos",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Workinfo",
          id: arg.id,
        },
      ],
    }),
  }),
});

// Educ infos
export const educinfosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEducinfos: builder.query({
      query: () => ({
        url: "/educinfos",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedEducinfos = responseData.map((educinfo) => {
          educinfo.id = educinfo._id;
          return educinfo;
        });
        return educinfosAdapter.setAll(educInitialState, loadedEducinfos);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Educinfos", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Educinfos", id })),
          ];
        } else return [{ type: "Educinfos", id: "LIST" }];
      },
    }),
    addEducinfo: builder.mutation({
      query: (initialEducinfo) => ({
        url: "/educinfos",
        method: "POST",
        body: {
          ...initialEducinfo,
        },
      }),
      invalidatesTags: [
        {
          type: "Educinfo",
          id: "LIST",
        },
      ],
    }),
    updateEducinfo: builder.mutation({
      query: (initialEducinfo) => ({
        url: "/educinfo",
        method: "PATCH",
        body: {
          ...initialEducinfo,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Educinfo",
          id: arg.id,
        },
      ],
    }),
    deleteEducinfo: builder.mutation({
      query: ({ id }) => ({
        url: "/educinfo",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Educinfo",
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

export const {
  useGetDependentsQuery,
  useAddDependentMutation,
  useUpdateDependentMutation,
  useDeleteDependentMutation,
} = dependentsApiSlice;

export const {
  useGetWorkinfosQuery,
  useAddWorkinfoMutation,
  useUpdateWorkinfoMutation,
  useDeleteWorkinfoMutation,
} = workinfosApiSlice;

export const {
  useGetEducinfosQuery,
  useAddEducinfoMutation,
  useUpdateEducinfoMutation,
  useDeleteEducinfoMutation,
} = educinfosApiSlice;

export const selectGeninfosResult =
  geninfosApiSlice.endpoints.getGeninfos.select();

export const selectPersonalinfosResult =
  personalinfosApiSlice.endpoints.getPersonalinfos.select();

export const selectDependentsResult =
  dependentsApiSlice.endpoints.getDependents.select();

export const selectWorkinfosResult =
  workinfosApiSlice.endpoints.getWorkinfos.select();

export const selectEducinfosResult =
  educinfosApiSlice.endpoints.getEducinfos.select();

const selectGeninfosData = createSelector(
  selectGeninfosResult,
  (geninfosResult) => geninfosResult.data
);

const selectPersonalinfosData = createSelector(
  selectPersonalinfosResult,
  (personalinfosResult) => personalinfosResult.data
);

const selectDependentsData = createSelector(
  selectDependentsResult,
  (dependentsResult) => dependentsResult.data
);

const selectWorkinfosData = createSelector(
  selectWorkinfosResult,
  (workinfosResult) => workinfosResult.data
);

const selectEducinfosData = createSelector(
  selectEducinfosResult,
  (educinfosResult) => educinfosResult.data
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

export const {
  selectAll: selectAllDependents,
  selectById: selectDependentById,
  selectIds: selectDependentIds,
} = dependentsAdapter.getSelectors(
  (state) => selectDependentsData(state) ?? depInitialState
);

export const {
  selectAll: selectAllWorkinfos,
  selectById: selectWorkinfoById,
  selectIds: selectWorkinfoIds,
} = workinfosAdapter.getSelectors(
  (state) => selectWorkinfosData(state) ?? workInitialState
);

export const {
  selectAll: selectAllEducinfos,
  selectById: selectEducinfoById,
  selectIds: selectEducinfoIds,
} = educinfosAdapter.getSelectors(
  (state) => selectEducinfosData(state) ?? educInitialState
);
