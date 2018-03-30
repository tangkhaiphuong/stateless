/**
 * @link: https://github.com/dotnet-state-machine/stateless/blob/dev/example/TelephoneCallExample/PhoneCall.cs
 */

import { PhoneCall } from './phone-call';

(async () => {
  const phoneCall = new PhoneCall('Lokesh');
  await phoneCall.print();
  await phoneCall.dialed('Prameela');
  await phoneCall.print();
  await phoneCall.connected();
  await phoneCall.print();
  await phoneCall.setVolume(2);
  await phoneCall.print();
  await phoneCall.hold();
  await phoneCall.print();
  await phoneCall.mute();
  await phoneCall.print();
  await phoneCall.unmute();
  await phoneCall.print();
  await phoneCall.resume();
  await phoneCall.print();
  await phoneCall.setVolume(11);
  await phoneCall.print();
  console.log('----------------------------------');
  console.log('DOT graph:');
  console.log();
  console.log(phoneCall.toDotGraph());
})();
