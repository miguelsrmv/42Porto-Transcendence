const httpErrorMessages = {
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
* @brief Initializes view for error page
*
* This function shows up an error, then navigates back to landing page
*/
export async function initializeView(errorCode) {
    const message = httpErrorMessages[errorCode] || 'An unexpected error occurred.';
    const errorMessageElement = document.getElementById('error-message');
    if (errorMessageElement) {
        errorMessageElement.textContent = `Error ${errorCode}: ${message}`;
    }
    console.error(`Error ${errorCode}: ${message}`);
}
//# sourceMappingURL=error.js.map