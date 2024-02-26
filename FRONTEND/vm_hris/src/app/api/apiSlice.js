import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setCredentials } from "../../features/auth/authSlice";

const baseUrls = ["http://192.168.1.6:3500", "http://localhost:3500"];

const fetchIpAddress = () => {
  fetch("/ipaddress")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch IP address from the server");
      }
      return response.json();
    })
    .then((ipAddresses) => {
      // Do something with the retrieved IP addresses
      console.log("Local IP addresses:", ipAddresses);
      // If you only need the first IP address, you can access it like this:
      const firstIpAddress = ipAddresses[0];
      console.log("First local IP address:", firstIpAddress);
    })
    .catch((error) => {
      console.error("Error fetching IP address:", error.message);
    });
};

//fetchIpAddress();

const baseQuery = fetchBaseQuery({
  baseUrl: baseUrls[0],
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // if access token has already expired, request a new token
  if (result?.error?.status === 403) {
    console.log("sending refresh token");

    // send the new token
    const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

    if (refreshResult?.data) {
      // store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }));

      // retry the query using the new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message =
          "Your login authentication has expired. ";
      }
      return refreshResult;
    }
  } else if (result?.error?.status === 400) {
    console.log(result.error.data.message);
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Announcement",
    "User",
    "GenInfo",
    "PersonalInfo",
    "Dependent",
    "EducInfo",
    "WorkInfo",
    "Celebrant",
    "Document",
    "Leave",
    "LeaveCredit",
    "Attendance",
  ],
  endpoints: (builder) => ({}),
});
