const { exec } = require('child_process');
const fs = require('fs');

console.log('Starting generation...');
exec('npx prisma generate', { cwd: process.cwd() }, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        fs.writeFileSync('gen_error.log', error.toString());
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    fs.writeFileSync('gen_stdout.log', stdout);
    fs.writeFileSync('gen_stderr.log', stderr);
});
