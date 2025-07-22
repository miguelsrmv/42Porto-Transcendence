/**
 * @file error.ts
 * @brief Provides error handling functionalities for displaying error messages.
 *
 * This module contains a mapping of HTTP error codes to user-friendly messages
 * and a function to initialize the error view on the page.
 */

/**
 * @brief A mapping of HTTP status codes to error messages.
 *
 * This constant provides user-friendly error messages corresponding to various
 * HTTP status codes that might be encountered during API requests.
 */
const httpErrorMessages: Record<number, string> = {
  400: 'Bad Request – The server could not understand your request.',
  401: 'Unauthorized – Please log in to continue.',
  403: 'Forbidden – You do not have permission to view this page.',
  404: 'Not Found – The requested page could not be found.',
  408: 'Request Timeout – The server timed out waiting for your request.',
  429: 'Too Many Requests – You’ve made too many requests in a short time.',
  500: 'Internal Server Error – Something went wrong on our end.',
  502: 'Bad Gateway – Received an invalid response from the upstream server.',
  503: 'Service Unavailable – The server is currently unavailable (overloaded or down).',
  504: 'Gateway Timeout – The upstream server failed to send a request in time.',
};

/**
 * @brief Initializes the view for the error page.
 *
 * This function displays an error message based on the provided error code
 * and logs the error to the console. It updates the error message element
 * on the page with the corresponding error message.
 *
 * @param errorCode The HTTP status code representing the error.
 */
export async function initializeView(errorCode: number): Promise<void> {
  const message = httpErrorMessages[errorCode] || 'An unexpected error occurred.';

  const errorMessageElement = document.getElementById('error-message');
  if (errorMessageElement) {
    errorMessageElement.textContent = `Error ${errorCode}: ${message}`;
  }

  // console.error(`Error ${errorCode}: ${message}`);
}
