const pattern = /^((\+|00)32\s?|0)(\d\s?\d{3}|\d{2}\s?\d{2})(\s?\d{2}){2}$/;
const patternMobile = /^((\+|00)32\s?|0)4(60|[789]\d)(\s?\d{2}){3}$/;

export const PHONE_FIXED = "PHONE_FIXED";
export const PHONE_MOBILE = "PHONE_MOBILE";

export const validatePhone = (phone:string):boolean => {
  if (typeof phone === "undefined") return;
  const p = phoneReverseTransform(phone);

  if (p === "") return true;

  if (p.match(pattern) || p.match(patternMobile)) return true;

  return false;
}

export const getPhoneType = (phone:string):string => {
  if (phone.match(pattern)) return PHONE_FIXED;
  if (phone.match(patternMobile)) return PHONE_MOBILE;
}

export const phoneReverseTransform = (phone:string):string => {
  if (typeof phone === "undefined") return;
  if (!phone.length) return phone;

  let p:string;

  p = phone.replace(/[^0-9+]/g, '');
  p = p.replace(/^00/g, '+');
  p = p.replace(/^0/g, '');

  if (p.substr(3, 1) === '0') {
    p = `${p.substr(0, 3)}${p.substr(4)}`;
  }

  if (p.substr(0, 1) !== '+') {
    p = `+32${p}`;
  }

  console.log(p);
  return p;
}

export const phoneTransform = (phone:string):string => {
  if (typeof phone === "undefined") return;
  let p = phone.trim();
  const type = getPhoneType(p);
  const patterns = {
    [PHONE_FIXED]: /^(\+\d{2})?(0?\d)(\d{3})(\d{2})(\d{2})$/i,
    [PHONE_MOBILE]: /^(\+\d{2})(\d{3})(\d{2})(\d{2})(\d{2})$/i
  }


  if (typeof type !== "undefined" && p !== "") {
    const m = p.match(patterns[type]);
    return `${m[1]} ${m[2]} ${m[3]} ${m[4]} ${m[5]}`;
  }

  return p;
}
