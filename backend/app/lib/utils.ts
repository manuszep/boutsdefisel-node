export const slugify = (val:string):string =>
  val.toString().toLowerCase()
    // Replace spaces with -
    .replace(/\s+/g, '-')
    // Remove all non-word chars
    .replace(/[^\w-]+/g, '')
    // Replace multiple - with single -
    .replace(/--+/g, '-')
    // Trim - from start of text
    .replace(/^-+/, '')
    // Trim - from end of text
    .replace(/-+$/, '');

export const camelize = (val:string, first:boolean = false):string => {
  const tmp = val.replace(
    /(?:^\w|[A-Z]|\b\w)/g,
    (letter, index) => (index === 0 ? letter.toLowerCase() : letter.toUpperCase())
  ).replace(/\s+/g, '');

  return (first) ? tmp.charAt(0).toUpperCase() + tmp.slice(1) : tmp;
};

export const uuid = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
