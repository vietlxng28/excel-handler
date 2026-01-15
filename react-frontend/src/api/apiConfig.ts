import type { ApiConfig } from "./apiService";

export const ENDPOINT: Record<string, ApiConfig> = {
  USER: {
    endpoint: "/users",
    method: "GET",
  },
  UPLOAD_EXCEL: {
    endpoint: "/api/excel/parse-to-json",
    method: "POST",
    headers: { "Content-Type": "multipart/form-data" },
  },
};
