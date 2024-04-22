import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const geninfosAdapter = createEntityAdapter({});
const personalinfosAdapter = createEntityAdapter({});
const dependentsAdapter = createEntityAdapter({});
const workinfosAdapter = createEntityAdapter({});
const educinfosAdapter = createEntityAdapter({});
const documentsAdapter = createEntityAdapter({});
const inactiveEmpsAdapter = createEntityAdapter({});
const employeeRecordsAdapter = createEntityAdapter({});

const genInitialState = geninfosAdapter.getInitialState();
const personalInitialState = personalinfosAdapter.getInitialState();
const depInitialState = dependentsAdapter.getInitialState();
const workInitialState = workinfosAdapter.getInitialState();
const educInitialState = educinfosAdapter.getInitialState();
const docuInitialState = documentsAdapter.getInitialState();
const inactiveEmpsInitialState = inactiveEmpsAdapter.getInitialState();
const employeeRecordsInitialState = employeeRecordsAdapter.getInitialState();

// Employee records
export const employeeRecordsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeRecords: builder.query({
      query: () => ({
        url: "/employeerecords",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedEmployeeRecords = responseData.map((employeerecord) => {
          employeerecord.id = employeerecord._id;
          return employeerecord;
        });
        return employeeRecordsAdapter.setAll(
          employeeRecordsInitialState,
          loadedEmployeeRecords
        );
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Employeerecord", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Employeerecord", id })),
          ];
        } else return [{ type: "Employeerecord", id: "LIST" }];
      },
    }),
    addEmployeeRecord: builder.mutation({
      query: (initialEmployeerecord) => ({
        url: "/employeerecords",
        method: "POST",
        body: {
          ...initialEmployeerecord,
        },
      }),
      invalidatesTags: [
        {
          type: "EmployeeRecord",
          id: "LIST",
        },
      ],
    }),
    updateEmployeerecord: builder.mutation({
      query: (initialEmployeerecord) => ({
        url: "/employeerecords",
        method: "PATCH",
        body: {
          ...initialEmployeerecord,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Employeerecord",
          id: arg.id,
        },
      ],
    }),
  }),
});

export const {
  useGetEmployeeRecordsQuery,
  useAddEmployeeRecordMutation,
  useUpdateEmployeerecordMutation,
} = employeeRecordsApiSlice;

export const selectEmployeerecordsResult =
  employeeRecordsApiSlice.endpoints.getEmployeeRecords.select();

const selectEmployeerecordsData = createSelector(
  selectEmployeerecordsResult,
  (employeerecordsResult) => employeerecordsResult.data
);

export const {
  selectAll: selectAllEmployeerecords,
  selectById: selectEmployeerecordsById,
  selectIds: selectEmployeerecordIds,
} = employeeRecordsAdapter.getSelectors(
  (state) => selectEmployeerecordsData(state) ?? employeeRecordsInitialState
);

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

export const {
  useGetGeninfosQuery,
  useAddGeninfoMutation,
  useUpdateGeninfoMutation,
} = geninfosApiSlice;

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
} = geninfosAdapter.getSelectors(
  (state) => selectGeninfosData(state) ?? genInitialState
);

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
  useGetPersonalinfosQuery,
  useAddPersonalinfoMutation,
  useUpdatePersonalinfoMutation,
} = personalinfosApiSlice;

export const selectPersonalinfosResult =
  personalinfosApiSlice.endpoints.getPersonalinfos.select();

const selectPersonalinfosData = createSelector(
  selectPersonalinfosResult,
  (personalinfosResult) => personalinfosResult.data
);

export const {
  selectAll: selectAllPersonalinfos,
  selectById: selectPersonalinfoById,
  selectIds: selectPersonalinfoIds,
} = personalinfosAdapter.getSelectors(
  (state) => selectPersonalinfosData(state) ?? personalInitialState
);

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

export const {
  useGetDependentsQuery,
  useAddDependentMutation,
  useUpdateDependentMutation,
  useDeleteDependentMutation,
} = dependentsApiSlice;

export const selectDependentsResult =
  dependentsApiSlice.endpoints.getDependents.select();

const selectDependentsData = createSelector(
  selectDependentsResult,
  (dependentsResult) => dependentsResult.data
);

export const {
  selectAll: selectAllDependents,
  selectById: selectDependentById,
  selectIds: selectDependentIds,
} = dependentsAdapter.getSelectors(
  (state) => selectDependentsData(state) ?? depInitialState
);

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

export const {
  useGetWorkinfosQuery,
  useAddWorkinfoMutation,
  useUpdateWorkinfoMutation,
  useDeleteWorkinfoMutation,
} = workinfosApiSlice;

export const selectWorkinfosResult =
  workinfosApiSlice.endpoints.getWorkinfos.select();

const selectWorkinfosData = createSelector(
  selectWorkinfosResult,
  (workinfosResult) => workinfosResult.data
);

export const {
  selectAll: selectAllWorkinfos,
  selectById: selectWorkinfoById,
  selectIds: selectWorkinfoIds,
} = workinfosAdapter.getSelectors(
  (state) => selectWorkinfosData(state) ?? workInitialState
);

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
        url: "/educinfos",
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
        url: "/educinfos",
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
  useGetEducinfosQuery,
  useAddEducinfoMutation,
  useUpdateEducinfoMutation,
  useDeleteEducinfoMutation,
} = educinfosApiSlice;

export const selectEducinfosResult =
  educinfosApiSlice.endpoints.getEducinfos.select();

const selectEducinfosData = createSelector(
  selectEducinfosResult,
  (educinfosResult) => educinfosResult.data
);

export const {
  selectAll: selectAllEducinfos,
  selectById: selectEducinfoById,
  selectIds: selectEducinfoIds,
} = educinfosAdapter.getSelectors(
  (state) => selectEducinfosData(state) ?? educInitialState
);

// Documents
export const documentsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDocuments: builder.query({
      query: () => ({
        url: "/documents",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedDocuments = responseData.map((docus) => {
          docus.id = docus._id;
          return docus;
        });
        return documentsAdapter.setAll(docuInitialState, loadedDocuments);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "Documents", id: "LIST" },
            ...result.ids.map((id) => ({ type: "Documents", id })),
          ];
        } else return [{ type: "Documents", id: "LIST" }];
      },
    }),
    /* addEducinfo: builder.mutation({
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
        url: "/educinfos",
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
        url: "/educinfos",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "Educinfo",
          id: arg.id,
        },
      ],
    }), */
  }),
});

export const { useGetDocumentsQuery } = documentsApiSlice;

export const selectDocusResult =
  documentsApiSlice.endpoints.getDocuments.select();

const selectDocumentsData = createSelector(
  selectDocusResult,
  (documentsResult) => documentsResult.data
);

export const {
  selectAll: selectAllDocuments,
  selectById: selectDocumentById,
  selectIds: selectDocumentIds,
} = documentsAdapter.getSelectors(
  (state) => selectDocumentsData(state) ?? docuInitialState
);

// Inactive Employees
export const inactiveEmpApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInactiveEmps: builder.query({
      query: () => ({
        url: "/inactiveemps",
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        },
      }),
      transformResponse: (responseData) => {
        const loadedInactiveEmps = responseData.map((inactiveEmp) => {
          inactiveEmp.id = inactiveEmp._id;
          return inactiveEmp;
        });
        return inactiveEmpsAdapter.setAll(genInitialState, loadedInactiveEmps);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "InactiveEmp", id: "LIST" },
            ...result.ids.map((id) => ({ type: "InactiveEmp", id })),
          ];
        } else return [{ type: "InactiveEmp", id: "LIST" }];
      },
    }),
    addInactiveEmp: builder.mutation({
      query: (initialInactiveEmp) => ({
        url: "/inactiveemps",
        method: "POST",
        body: {
          ...initialInactiveEmp,
        },
      }),
      invalidatesTags: [
        {
          type: "InactiveEmp",
          id: "LIST",
        },
      ],
    }),
    updateInactiveEmp: builder.mutation({
      query: (initialInactiveEmp) => ({
        url: "/inactiveemps",
        method: "PATCH",
        body: {
          ...initialInactiveEmp,
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "InactiveEmp",
          id: arg.id,
        },
      ],
    }),
    deleteInactiveEmp: builder.mutation({
      query: ({ id }) => ({
        url: "/inactiveemps",
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: "InactiveEmp",
          id: arg.id,
        },
      ],
    }),
  }),
});

export const {
  useGetInactiveEmpsQuery,
  useAddInactiveEmpMutation,
  useUpdateInactiveEmpMutation,
  useDeleteInactiveEmpMutation,
} = inactiveEmpApiSlice;

export const selectInactiveEmpsResult =
  inactiveEmpApiSlice.endpoints.getInactiveEmps.select();

const selectInactiveEmpsData = createSelector(
  selectInactiveEmpsResult,
  (inactiveEmpsResult) => inactiveEmpsResult.data
);

export const {
  selectAll: selectAllInactiveEmps,
  selectById: selectInactiveEmpById,
  selectIds: selectInactiveEmpIds,
} = inactiveEmpsAdapter.getSelectors(
  (state) => selectInactiveEmpsData(state) ?? inactiveEmpsInitialState
);
