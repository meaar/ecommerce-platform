function getPositiveInteger(value, fallback) {
  const parsedValue = Number(value ?? fallback);
  return Number.isInteger(parsedValue) && parsedValue > 0 ? parsedValue : fallback;
}

const env = Object.freeze({
  port: getPositiveInteger(process.env.PORT, 3000),
  session: Object.freeze({
    cookieName: 'ecommerce_session',
    maxAgeMs: 1000 * 60 * 60 * 24 * 7,
    secureCookie: process.env.NODE_ENV === 'production',
  }),
  frontendOrigin: process.env.FRONTEND_ORIGIN || 'http://localhost:4200',
  database: Object.freeze({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: getPositiveInteger(process.env.POSTGRES_PORT, 5432),
    database: process.env.POSTGRES_DB || 'ecommerce',
    user: process.env.POSTGRES_USER || 'ecommerce',
    password: process.env.POSTGRES_PASSWORD || 'ecommerce-development-password',
  }),
  rustfs: Object.freeze({
    endpoint: process.env.RUSTFS_ENDPOINT || 'http://localhost:9000',
    region: process.env.RUSTFS_REGION || 'us-east-1',
    accessKey: process.env.RUSTFS_ACCESS_KEY || 'rustfsadmin',
    secretKey: process.env.RUSTFS_SECRET_KEY || 'rustfsadmin',
    bucket: process.env.RUSTFS_BUCKET || 'profile-images',
  }),
});

module.exports = { env };
