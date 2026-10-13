// admin-react/src/pages/crm/Reminders/API.js

import apiClient from "../../../app/apiClient";


// ============================================================
// GET REMINDERS - MANAGEMENT PAGE
// ============================================================
//
// Dedicated API for the Reminders management page.
//
// Backend:
// GET /reminders/management
//
// Supported query parameters:
// - page
// - page_size
// - search
// - employee_id
// - status
//
// This is completely separate from the existing:
// GET /reminders
//
// The existing reminder drawer continues using its existing API.
// ============================================================

export async function getReminders({
  page = 1,
  pageSize = 25,
  search = "",
  employeeId = null,
  status = "",
} = {}) {

  try {

    // ========================================================
    // QUERY PARAMETERS
    // ========================================================

    const params = {
      page,
      page_size: pageSize,
    };


    // ========================================================
    // SEARCH
    // ========================================================

    const trimmedSearch =
      typeof search === "string"
        ? search.trim()
        : "";


    if (trimmedSearch) {

      params.search = trimmedSearch;

    }


    // ========================================================
    // EMPLOYEE FILTER
    // ========================================================

    if (
      employeeId !== null &&
      employeeId !== undefined &&
      employeeId !== ""
    ) {

      params.employee_id = employeeId;

    }


    // ========================================================
    // STATUS FILTER
    // ========================================================

    if (status) {

      params.status = status;

    }


    // ========================================================
    // API REQUEST
    // ========================================================

    const response = await apiClient.get(
      "/reminders/management",
      {
        params,
      }
    );


    // ========================================================
    // RESPONSE
    // ========================================================

    const result = response.data;


    if (
      !result ||
      typeof result !== "object"
    ) {

      throw new Error(
        "Unexpected reminders API response format"
      );

    }


    return {
      items: Array.isArray(result.items)
        ? result.items
        : [],

      pagination:
        result.pagination &&
        typeof result.pagination === "object"
          ? result.pagination
          : {
              page,
              page_size: pageSize,
              total: 0,
              total_pages: 0,
              has_next: false,
              has_previous: false,
            },
    };

  } catch (error) {

    console.error(
      "[Reminders API] Failed to fetch reminders:",
      error
    );

    throw error;

  }

}