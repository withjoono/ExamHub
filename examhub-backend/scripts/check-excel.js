const { Pool } = require('pg');
const DB_URL = 'postgresql://tsuser:tsuser1234@34.64.165.158:5432/geobukschool_prod';
async function main() {
    const pool = new Pool({ connectionString: DB_URL, max: 3 });
    try {
        await pool.query('SET search_path TO examhub');
        const res = await pool.query(`
            SELECT e.code, e.name, count(*) as cnt
            FROM eh_2015_cumulative_top_pct c
            JOIN eh_mock_exams e ON c.mock_exam_id = e.id
            GROUP BY e.code, e.name ORDER BY e.code
        `);
        res.rows.forEach(r => console.log(`${r.code} ${r.name}: ${r.cnt} rows`));
        const total = await pool.query('SELECT count(*) as cnt FROM eh_2015_cumulative_top_pct');
        console.log(`Total: ${total.rows[0].cnt}`);
    } finally { await pool.end(); }
}
main().catch(console.error);
