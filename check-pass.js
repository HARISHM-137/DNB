const bcrypt = require('bcryptjs');

const hash = '$2b$10$l8zbSCrPDqDbS34ydzfTlOvrqVA9IzGFk0zAIy6k5grW3BzqvtHRq';
const candidates = ['hod', 'hod123', 'admin', 'admin123', 'password'];

async function check() {
    for (const pass of candidates) {
        const match = await bcrypt.compare(pass, hash);
        console.log(`Password '${pass}': ${match ? 'MATCH ✅' : 'NO ❌'}`);
    }
}

check();
