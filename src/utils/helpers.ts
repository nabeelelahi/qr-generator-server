export const strSlug = (string: string) => {
  return string
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[-]+/g, '-')
    .replace(/[^\w-]+/g, '');
};
