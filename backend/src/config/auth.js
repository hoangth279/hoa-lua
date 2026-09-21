const developmentSecret = 'hoa-lua-local-development-only-secret-change-before-production';

function getJwtSecret() {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  return process.env.NODE_ENV === 'production' ? '' : developmentSecret;
}

module.exports = { getJwtSecret };
