/**
 * Candidate detail validation, shared by the start form (client) and the
 * server actions, so the same rules apply on both sides.
 */

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}'’ .-]*$/u;
const PHONE_PATTERN = /^\+?[\d\s().-]+$/;

export const NAME_MAX_LENGTH = 60;
export const PHONE_MAX_LENGTH = 25;

export function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function normalizePhone(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function validateName(raw: string): string | null {
  const name = normalizeName(raw);
  if (name.length === 0) return "Please enter your full name.";
  if (name.length < 2) return "Your name must be at least 2 characters.";
  if (name.length > NAME_MAX_LENGTH) return `Your name must be ${NAME_MAX_LENGTH} characters or fewer.`;
  if (!NAME_PATTERN.test(name)) return "Please use letters, spaces, hyphens or apostrophes only.";
  return null;
}

export function validatePhone(raw: string): string | null {
  const phone = normalizePhone(raw);
  if (phone.length === 0) return "Please enter your phone number.";
  if (phone.length > PHONE_MAX_LENGTH || !PHONE_PATTERN.test(phone)) {
    return "Please use digits only, with an optional + at the start.";
  }
  const digits = phone.replace(/\D/g, "").length;
  if (digits < 7 || digits > 15) return "Please enter a valid phone number (7 to 15 digits).";
  return null;
}
