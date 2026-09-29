// Prints an ADMIN_PASSWORD_HASH line for .env.local / Vercel.
// The bcrypt hash is base64-encoded because Next expands `$` in env files, which would corrupt it.
import { createInterface } from "node:readline";
import bcrypt from "bcryptjs";

function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    let muted = false;
    rl._writeToOutput = (text) => {
      if (!muted) rl.output.write(text);
    };
    rl.question(question, (answer) => {
      rl.close();
      process.stdout.write("\n");
      resolve(answer);
    });
    muted = true;
  });
}

const password = await promptHidden("Admin password: ");
if (password.length < 12) {
  console.error("Use at least 12 characters.");
  process.exit(1);
}
const confirmation = await promptHidden("Confirm password: ");
if (password !== confirmation) {
  console.error("Passwords do not match.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
console.log(`\nADMIN_PASSWORD_HASH=${Buffer.from(hash).toString("base64")}`);
