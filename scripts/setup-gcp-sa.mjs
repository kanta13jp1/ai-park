/**
 * setup-gcp-sa.mjs
 * Cross-platform script to provision a GCP Service Account for usage syncing
 * and automatically register its credentials in GitHub Secrets (GCP_SA_KEY).
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ID = process.env.GCP_PROJECT_ID || 'antigravity-pj-509006';
const SA_NAME = 'ai-park-usage-sync';
const DISPLAY_NAME = 'AI Park Usage Sync Service Account';
const ROLE = 'roles/logging.viewer';
const SA_EMAIL = `${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com`;
const TEMP_KEY_FILE = path.join(__dirname, '.temp-sa-key.json');

function run(cmd, desc) {
  console.log(`\n⏳ ${desc}...`);
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
  } catch (err) {
    const stderr = err.stderr ? err.stderr.toString() : err.message;
    console.error(`❌ Error during: ${desc}`);
    console.error(stderr);
    throw err;
  }
}

async function main() {
  console.log('=================================================');
  console.log('  MightyLINK AI Park: GCP SA Setup Pipeline      ');
  console.log('=================================================');

  // 1. Check prerequisites
  try {
    execSync('gcloud --version', { stdio: 'ignore' });
    execSync('gh --version', { stdio: 'ignore' });
    console.log('✅ OK: gcloud and gh CLI are available.');
  } catch {
    console.error('❌ Missing prerequisite: Ensure gcloud and gh CLI are installed and in PATH.');
    process.exit(1);
  }

  // 2. Check or create SA
  let saExists = false;
  try {
    const existing = execSync(`gcloud iam service-accounts list --project=${PROJECT_ID} --filter="email:${SA_EMAIL}" --format="value(email)"`, { encoding: 'utf-8' }).trim();
    if (existing) saExists = true;
  } catch {}

  if (!saExists) {
    run(
      `gcloud iam service-accounts create ${SA_NAME} --project=${PROJECT_ID} --display-name="${DISPLAY_NAME}" --description="Antigravity usage sync"`,
      `Creating Service Account: ${SA_NAME}`
    );
    console.log('✅ Created Service Account.');
  } else {
    console.log(`✅ Existing Service Account found: ${SA_EMAIL}`);
  }

  // 3. Grant IAM Role
  run(
    `gcloud projects add-iam-policy-binding ${PROJECT_ID} --member="serviceAccount:${SA_EMAIL}" --role="${ROLE}" --condition=None --quiet`,
    `Granting role ${ROLE}`
  );
  console.log(`✅ Granted ${ROLE} to ${SA_EMAIL}.`);

  // 4. Generate Key
  if (fs.existsSync(TEMP_KEY_FILE)) fs.unlinkSync(TEMP_KEY_FILE);
  run(
    `gcloud iam service-accounts keys create "${TEMP_KEY_FILE}" --iam-account="${SA_EMAIL}" --project="${PROJECT_ID}" --key-file-type="json"`,
    'Generating Service Account JSON Key'
  );
  console.log('✅ Generated temporary JSON key.');

  // 5. Register in GitHub Secrets
  try {
    console.log('\n⏳ Registering GitHub Secret (GCP_SA_KEY)...');
    execSync(`gh secret set GCP_SA_KEY < "${TEMP_KEY_FILE}"`, { shell: true, stdio: 'inherit' });
    console.log('✅ Successfully registered GCP_SA_KEY in GitHub Secrets!');
  } finally {
    if (fs.existsSync(TEMP_KEY_FILE)) {
      fs.unlinkSync(TEMP_KEY_FILE);
      console.log('✅ Temporary key file safely deleted.');
    }
  }

  console.log('\n=================================================');
  console.log('🎉 Setup Completed! Automated GCP usage sync is now enabled.');
  console.log('=================================================');
}

main().catch((err) => {
  console.error('\n❌ Setup failed:', err.message);
  process.exit(1);
});
