import { exec } from 'child_process';
import * as path from 'path';

const baseDirectory = path.join(__dirname, '../../database/migrations');

const filename = process.argv[2];

if (!filename) {
  console.error('Please provide a filename for the migration.');
  process.exit(1);
}

const fullPath = path.join(baseDirectory, filename);

const command = `yarn typeorm migration:generate ${fullPath}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error generating migration: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Error output: ${stderr}`);
    return;
  }
  console.log(`Migration generated successfully: ${stdout}`);
});
