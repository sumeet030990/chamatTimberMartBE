/**
 * @desc    Send any success response
 *
 * @param   {any} body
 * @param   {number} statusCode
 */
const successResponse = (body, statusCode = 200) => ({
  error: false,
  code: statusCode,
  body,
});

/**
 * @desc    Send any error response
 *
 * @param   {any} body
 * @param   {number} statusCode
 */
const errorResponse = (body, statusCode = 500) => ({
  error: true,
  code: statusCode,
  body,
});

export { successResponse, errorResponse };
