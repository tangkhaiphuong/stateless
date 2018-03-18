import { Bug } from './bug';

(async (): Promise<void> => {
  const bug = new Bug('Incorrect stock count');
  await bug.assign('Joe');
  await bug.defer();
  await bug.assign('Harry');
  await bug.assign('Fred');
  await bug.close();

  console.log();
  console.log('State machine:');
  console.log(bug.toDotGraph());
})();
