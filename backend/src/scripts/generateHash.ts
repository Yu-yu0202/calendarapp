/*
Warning!warning!warning!
this script is only for generating hash for admin password.
Please do not use this script for other purposes.
*/
import bcrypt from 'bcryptjs';
//@ts-ignore
import process from 'node:process';

async function main() {
  console.warn('Warning!warning!warning!\n This script is only for generating hash for admin password.\n Please do not use this script for other purposes.\n');
  console.warn('if continue, please input "yes"');

  const input = await new Promise<string>((resolve) => {
    const stdin = process.stdin;
    stdin.setEncoding('utf8');
    stdin.on('data', (data) => {
      resolve(data.toString().trim());
    });
  });

  if (input !== 'yes') {
    console.warn('abort.');
    process.exit(1);
  }

  // コマンドライン引数からパスワードを取得
  const password = process.argv[2];

  if (!password) {
    console.error('使用方法: npx ts-node src/scripts/generateHash.ts <password>');
    process.exit(1);
  }

  await generateHash(password);
}

async function generateHash(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  console.log(hash);
}

main().catch(console.error)
      .then(() => process.exit(0));