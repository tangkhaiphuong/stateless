/**
 * @link: https://github.com/dotnet-state-machine/stateless/blob/dev/example/JsonExample/Program.cs
 */

import { Member } from './member';

(async () => {
  console.log('Creating member from JSON');
  const aMember = Member.fromJson('{ "state":1, "name":"Jay"}');

  console.log(`Member ${aMember.name} created, membership state is ${aMember.state}`);

  await aMember.suspend();
  await aMember.reactivate();
  await aMember.terminate();

  console.log('Member JSON:');

  const jsonString = aMember.toJson();
  console.log(jsonString);

  const anotherMember = Member.fromJson(jsonString);

  if (aMember.equals(anotherMember)) {
    console.log('Members are equal');
  }
})();
