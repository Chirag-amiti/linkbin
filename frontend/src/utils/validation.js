export const aliasPattern = /^[a-z0-9-]{3,40}$/;
export const slugPattern = /^[a-z0-9-]{3,60}$/;

export const isValidUrl = (value) => {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
};

export const isPositiveInteger = (value) => {
  if (value === '') return true;
  return Number.isInteger(Number(value)) && Number(value) > 0;
};

export const mapApiValidationDetails = (details = []) => {
  return details.reduce((acc, issue) => {
    const field = issue.path?.split('.').pop();

    if (field) {
      acc[field] = issue.message;
    }

    return acc;
  }, {});
};
