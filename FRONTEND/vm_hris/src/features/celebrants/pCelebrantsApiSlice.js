import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const personalinfosAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    // Extract the 'Birthday' values
    const birthdayA = new Date(a.Birthday);
    const birthdayB = new Date(b.Birthday);

    // Extract day values
    const dayA = birthdayA.getDate();
    const dayB = birthdayB.getDate();

    // Compare the 'Birthday' values by day (earlier days are on top)
    if (dayA < dayB) {
      return -1;
    } else if (dayA > dayB) {
      return 1;
    } else {
      return 0;
    }
  },
});

const personalInitialState = personalinfosAdapter.getInitialState();

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

export const { useGetPersonalinfosQuery } = personalinfosApiSlice;

export const selectPersonalinfosResult =
  personalinfosApiSlice.endpoints.getPersonalinfos.select();

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
  (state) => selectPersonalinfosData(state) ?? personalInitialState
);
