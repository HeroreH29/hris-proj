import { apiSlice } from "../../app/api/apiSlice";

export const sendEmailApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendEmail: builder.mutation({
      query: (initialEmailData) => ({
        url: "/emailsender",
        method: "POST",
        body: {
          ...initialEmailData,
        },
      }),
    }),
  }),
});

export const { useSendEmailMutation } = sendEmailApiSlice;
