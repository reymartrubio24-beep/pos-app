import app from './app.js';
import { initDB } from './config/db.js';

const PORT = process.env.PORT || 3001;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`POS backend running on http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('Failed to init DB', e);
    process.exit(1);
  });
