import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const announcementsAdapter = createEntityAdapter({});

const initialState = announcementsAdapter.getInitialState();

export const announcementsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: () => "/announcements",
      validateStatus: (response, result) => {
        return response.status === 200 && !result.isError;
      },
      keepUnusedDataFor: 5,
      transformResponse: (responseData) => {
        const loadedAnnouncements = responseData.map((announcement) => {
          announcement.id = announcement._id;
          return announcement;
        });
        return announcementsAdapter.setAll(initialState, loadedAnnouncements);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Announcement", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Announcement", id })),
          ];
        } else return [{ type: "Announcement", id: "LIST" }];
      },
    }),
  }),
});

export const { useGetAnnouncementsQuery } = announcementsApiSlice;

// returns the query result object
export const selectAnnouncementsResult =
  announcementsApiSlice.endpoints.getAnnouncements.select();

// creates memoized selector
const selectAnnouncementsData = createSelector(
  selectAnnouncementsResult,
  (announcementsResult) => announcementsResult.data // normalized state object with ids & entities
);

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllAnnouncements,
  selectById: selectAnnouncementById,
  selectIds: selectAnnouncementIds,
  // Pass in a selector that returns the announcements slice of state
} = announcementsAdapter.getSelectors(
  (state) => selectAnnouncementsData(state) ?? initialState
);
