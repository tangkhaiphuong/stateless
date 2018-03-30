/**
 * @link: https://github.com/dotnet-state-machine/stateless/blob/dev/example/BugTrackerExample/Program.cs
 */

import { Bug } from './bug';

(async (): Promise<void> => {
  const bug = new Bug('Incorrect stock count');
  await bug.assign('Joe');
  await bug.defer();
  await bug.assign('Harry');
  await bug.assign('Fred');
  await bug.close();
  console.log('----------------------------------');
  console.log('DOT graph:');
  console.log();
  console.log(bug.toDotGraph());
})();
