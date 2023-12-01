import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

// Birthday celebrants will be fetched from personal infos collection

const personalinfosAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    const dateSplitter = (dateString) => {
      const [month, day, year] = dateString.split("/");

      return `${year}-${month - 1}-${day}`;
    };

    const dateStringA = a.Birthday;
    const dateStringB = b.Birthday;
    const birthdayA = new Date(dateSplitter(dateStringA).split("-"));
    const birthdayB = new Date(b.Birthday);

    if (birthdayA < birthdayB) {
      return -1;
    }
  },
});
const geninfosAdapter = createEntityAdapter({});

const personalInitialState = personalinfosAdapter.getInitialState();
const genInitialState = geninfosAdapter.getInitialState();

export const personalinfosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPersonalinfos: builder.query({
      query: () => "/personalinfos",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedPersonalinfos = responseData.map((personalinfo) => {
          personalinfo.id = personalinfo._id;
          return personalinfo;
        });
        return personalinfosAdapter.setAll(
          personalInitialState,
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
  }),
});
export const geninfosApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGeninfos: builder.query({
      query: () => "/geninfos",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      transformResponse: (responseData) => {
        const loadedGeninfos = responseData.map((geninfo) => {
          geninfo.id = geninfo._id;
          return geninfo;
        });
        return geninfosAdapter.setAll(personalInitialState, loadedGeninfos);
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

export const { useGetPersonalinfosQuery } = personalinfosApiSlice;
export const { useGetGeninfosQuery } = geninfosApiSlice;

// returns the query result object
export const selectPersonalinfosResult =
  personalinfosApiSlice.endpoints.getPersonalinfos.select();
export const selectGeninfosResult =
  geninfosApiSlice.endpoints.getGeninfos.select();

// creates memoized selector
const selectPersonalinfosData = createSelector(
  selectPersonalinfosResult,
  (personalinfosResult) => personalinfosResult.data // normalized state object with ids & entities
);
const selectGeninfosData = createSelector(
  selectGeninfosResult,
  (geninfosResult) => geninfosResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllPersonalinfos,
  selectById: selectPersonalinfoById,
  selectIds: selectPersonalinfoIds,
  // Pass in a selector that returns the personalinfos slice of state
} = personalinfosAdapter.getSelectors(
  (state) => selectPersonalinfosData(state) ?? personalInitialState
);
export const {
  selectAll: selectAllGeninfos,
  selectById: selectGeninfoById,
  selectIds: selectGeninfoIds,
  // Pass in a selector that returns the geninfos slice of state
} = geninfosAdapter.getSelectors(
  (state) => selectGeninfosData(state) ?? genInitialState
);
