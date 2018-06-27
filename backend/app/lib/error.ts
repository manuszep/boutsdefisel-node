const codes = {
  ER_DUP_ENTRY: 500,
  NO_CHANGES: 500,
  ALREADY_DELETED: 500,
  NO_AUTH: 403,
  NOT_FOUND: 404,
  CANNOT_DELETE: 500
};

export const handleError = (res, err) => {
  if (typeof err.code !== 'undefined' && typeof codes[err.code] !== 'undefined') {
    res.status(codes[err.code]).json(err);
    return;
  }

  res.status(500).json(err);
};
