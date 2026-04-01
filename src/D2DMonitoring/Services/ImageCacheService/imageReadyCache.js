/**
 * Shared image-ready registry.
 *
 * MonitoringAction ka preloadImage() — jab image fully download + decode ho jaye —
 * yahan mark karta hai.
 *
 * CrewCard ka isCached() — render se pehle yahan check karta hai.
 *
 * Dono alag files hain lekin ek hi Set share karte hain, isliye preloaded
 * images pe koi blur/flash nahi aata — instantly sharp dikhti hain.
 */

const readyUrls = new Set();

export const markImageReady = (url) => { if (url) readyUrls.add(url); };
export const isImageReady   = (url) => (url ? readyUrls.has(url) : false);
