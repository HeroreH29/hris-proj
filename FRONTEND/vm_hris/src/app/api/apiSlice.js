import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3500" }),
  tagTypes: ["Announcement", "User", "GenInfo", "PersonalInfo"],
  endpoints: (builder) => ({}),
});
