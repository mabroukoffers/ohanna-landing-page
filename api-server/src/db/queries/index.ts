/**
 * Database queries index
 * Centralized export of all query functions
 */

export { productQueries } from "./products";
export { orderQueries } from "./orders";
export { contactQueries } from "./contacts";

// Re-export for convenience
export { productQueries as products, orderQueries as orders, contactQueries as contacts };
