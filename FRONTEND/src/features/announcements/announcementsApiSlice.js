import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const announcementsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);

    if (dateA.getMilliseconds() < dateB.getMilliseconds()) {
      return -1;
    } else if (dateA.getMilliseconds() > dateB.getMilliseconds()) {
      return 1;
    } else {
      return 0;
    }
  },
});

const initialState = announcementsAdapter.getInitialState();

export const announcementsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnnouncements: builder.query({
      query: () => ({
        url: "/announcements",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
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
        } else if (error) {
          return [{ type: "Announcement", id: "LIST" }];
        } else return [{ type: "Announcement", id: "LIST" }];
      },
    }),
    addNewAnnouncement: builder.mutation({
      query: (initialAnnouncement) => ({
        url: "/announcements",
        method: "POST",
        body: {
          ...initialAnnouncement,
        },
      }),
      invalidatesTags: [{ type: "Announcement", id: "LIST" }],
    }),
    updateAnnouncement: builder.mutation({
      query: (initialAnnouncement) => ({
        url: "/announcements",
        method: "PATCH",
        body: {
          ...initialAnnouncement,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Announcement", id: arg.id },
      ],
    }),
    deleteAnnouncement: builder.mutation({
      query: ({ id }) => ({
        url: "/announcements",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Announcement",
          id: arg.id,
        },
      ],
    }),
  }),
});

export const {
  useGetAnnouncementsQuery,
  useAddNewAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
} = announcementsApiSlice;

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
