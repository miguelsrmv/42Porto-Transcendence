/**
 * @brief Pauses execution for a specified number of seconds.
 *
 * This function returns a promise that resolves after a given number of seconds,
 * effectively pausing the execution of asynchronous code for the specified duration.
 *
 * @param seconds The number of seconds to wait before the promise resolves.
 * @return A promise that resolves after the specified delay.
 */
export function wait(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
//# sourceMappingURL=helpers.js.map