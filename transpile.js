const { execSync } = require('child_process');
const fs = require('fs');

const dir = 'c:/entraiot-production-final/entraiot-unified/stage1/assets';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

for (const file of files) {
  const filepath = `${dir}/${file}`;
  console.log(`Transpiling ${file}...`);
  execSync(`npx esbuild "${filepath}" --outfile="${filepath}" --allow-overwrite --target=es2015`, { stdio: 'inherit' });
}
console.log("Done.");
