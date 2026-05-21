/**
 * Utility functions
 */

/**
 * Format price from cents to EGP string
 */
export function formatPrice(cents: number): string {
  return `EGP ${(cents / 100).toFixed(2)}`;
}

/**
 * Convert EGP to cents
 */
export function egpToCents(egp: number): number {
  return Math.round(egp * 100);
}

/**
 * Convert cents to EGP
 */
export function centsTOEgp(cents: number): number {
  return cents / 100;
}

/**
 * Generate order ID
 */
export function generateOrderId(): string {
  return `OHN-${Date.now()}`;
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (Egyptian format)
 */
export function isValidEgyptianPhone(phone: string): boolean {
  // Egyptian phone: +20 or 0 followed by 10 digits
  const phoneRegex = /^(\+20|0)[0-9]{10}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Calculate shipping cost
 */
export function calculateShippingCost(
  orderTotal: number,
  freeThreshold: number,
  standardFee: number
): number {
  return orderTotal >= freeThreshold ? 0 : standardFee;
}

/**
 * Paginate array
 */
export function paginate<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 20
): { items: T[]; total: number; page: number; pageSize: number; totalPages: number } {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    items: items.slice(start, end),
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
