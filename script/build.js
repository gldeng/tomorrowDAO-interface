const { spawn } = require('child_process');

const buildCommand = spawn('yarn', ['next-compile']);

buildCommand.stdout.on('data', (data) => {
  const output = data.toString();

  console.log(output);

  if (output.includes('Collecting build traces')) {
    console.log('build success');
    buildCommand.kill('SIGKILL');
    process.exit(0);
  }
});

buildCommand.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

buildCommand.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
  if (code !== 0) {
    process.exit(1);
  }
});
