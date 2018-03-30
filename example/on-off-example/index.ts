/**
 * @link: https://github.com/dotnet-state-machine/stateless/blob/dev/example/OnOffExample/Program.cs
 */

import { StateMachine } from '../../src';
import * as readline from 'readline';
import * as os from 'os';

const on = 'On';
const off = 'Off';
const space = ' ';

const onOffSwitch = new StateMachine<string, string>(off);

onOffSwitch.configure(off).permit(space, on);
onOffSwitch.configure(on).permit(space, off);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Press <space> to toggle the switch. Any other key will raise an error.');
process.stdout.write(os.EOL + 'Switch is in state: ' + onOffSwitch.state);
const stdin = process.openStdin();
stdin.on('keypress', async function (chunk, key) {
  try {
    if (chunk === '\u0003') { return process.exit(); }
    await onOffSwitch.fire(chunk);
    process.stdout.write(os.EOL + 'Switch is in state: ' + onOffSwitch.state);
  } catch (error) {
    stdin.removeAllListeners();
    console.log(os.EOL + 'Exception: ' + error.message);
    process.exit();
  }
  return;
});
