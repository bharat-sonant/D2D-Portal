/**
 * Service Invocation Logger
 * Tracks how many times each monitoring service function has been called.
 * Access stats anytime via: getServiceInvocationStats()
 */

const _counts = {};

/**
 * Log a service function call and increment its counter.
 * @param {string} service  - e.g. "HaltInfoService"
 * @param {string} fn       - e.g. "getHaltInfoFromDB"
 */
export const logServiceCall = (service, fn) => {
    const key = `${service}.${fn}`;
    _counts[key] = (_counts[key] || 0) + 1;
    console.count(key);
};

/**
 * Returns a snapshot of all invocation counts.
 * @returns {{ [key: string]: number }}
 */
export const getServiceInvocationStats = () => ({ ..._counts });
