import axios from "axios";

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again."
): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (error.response?.status === 503) {
      return "The service is temporarily unavailable. Please try again later.";
    }

    if (error.response?.status === 500) {
      return "Something went wrong on the server. Please try again.";
    }

    if (error.response?.status === 429) {
      return "Too many requests. Please wait a moment and try again.";
    }

    if (!error.response) {
      return "Unable to connect to the server. Please check your connection.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}