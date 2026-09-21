const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const clean = (value, max = 500) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
module.exports = { asyncHandler, clean, isEmail };
