// Regex to validate phone number
const pattern = /^((\+|00)32\s?|0)(\d\s?\d{3}|\d{2}\s?\d{2})(\s?\d{2}){2}$/;
// Regex to validate mobile phone number
const patternMobile = /^((\+|00)32\s?|0)4(60|[789]\d)(\s?\d{2}){3}$/;

export const PHONE_FIXED = "PHONE_FIXED";
export const PHONE_MOBILE = "PHONE_MOBILE";

/**
 * Validate a phone number against regex
 *
 * @param phone string
 * @returns boolean
 */
export const validatePhone = (phone:string):boolean => {
  // If phone number is empty, exit
  if (typeof phone === "undefined" || phone === null) return;
  // Convert number to database format
  const p = phoneReverseTransform(phone);

  // As the conversion trims the number, it could be empty now. Exit
  if (p === "") return true;

  if (p.match(pattern) || p.match(patternMobile)) return true;

  return false;
}

/**
 * Detect if phone number is mobile or fixed
 *
 * @param phone string
 * @returns string
 */
export const getPhoneType = (phone:string):string => {
  if (phone.match(pattern)) return PHONE_FIXED;
  if (phone.match(patternMobile)) return PHONE_MOBILE;
}

/**
 * Convert phone number string to database format
 *
 * @param phone string
 * @returns string
 */
export const phoneReverseTransform = (phone:string):string => {
  // If phone number is empty, return as is
  if (typeof phone === "undefined" || phone === null || !phone.length) return phone;

  let p:string;

  // Remove anything that's not a number or a +
  p = phone.replace(/[^0-9+]/g, '');
  // Replace the double 0 at the start by a +
  p = p.replace(/^00/g, '+');
  // Remove the 0 at the start
  p = p.replace(/^0/g, '');

  // If the country prefix is there, there might still be a 0 before the city prefix. Remove it
  if (p.substr(3, 1) === '0') {
    p = `${p.substr(0, 3)}${p.substr(4)}`;
  }

  // If there's no country prefix, add it
  if (p.substr(0, 1) !== '+') {
    p = `+32${p}`;
  }

  return p;
}

/**
 * Convert database phone format to readable format
 *
 * @param phone string
 * @returns string
 */
export const phoneTransform = (phone:string):string => {
  // If phone number is empty, return as is
  if (typeof phone === "undefined" || phone === null) return phone;
  // Remove any leading or trailing spaces
  let p = phone.trim();
  // Check type to choose formatting
  const type = getPhoneType(p);
  // Define matching patterns
  const patterns = {
    [PHONE_FIXED]: /^(\+\d{2})?(0?\d)(\d{3})(\d{2})(\d{2})$/i,
    [PHONE_MOBILE]: /^(\+\d{2})(\d{3})(\d{2})(\d{2})(\d{2})$/i
  }
  // If a type is found and trimmed number is not empty
  if (typeof type !== "undefined" && p !== "") {
    // Get matches array
    const m = p.match(patterns[type]);
    // Format result
    return `${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]}`;
  }

  return p;
}
