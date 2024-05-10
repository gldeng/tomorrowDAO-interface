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

buildCommand.on('error', (error) => {
  console.error(`build error: ${error.message}`);
});
