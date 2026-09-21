const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('./app');
const { ensureAdminFromEnv } = require('./services/admin-bootstrap.service');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';

async function start() {
    const admin = await ensureAdminFromEnv();
    if (!admin.skipped) console.log(`Admin bootstrap sẵn sàng: ${admin.email} (${admin.role}).`);
    app.listen(PORT, HOST, () => {
        console.log(`Hoa Lua web app running on ${HOST}:${PORT}`);
    });
}

start().catch((error) => {
    console.error('Không thể khởi động Họa Lụa:', error.message);
    process.exit(1);
});
