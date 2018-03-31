/**
 * Assets implement from: https://medium.com/@m3lles/stateless-a-lightweight-workflow-library-alternative-for-net-b739389bb049
 * 
 * @export
 * @class Asset
 * @link: https://github.com/trashvin/Tutorial_UsingStateless/blob/master/AssetWorkflow/Program.cs
 */

import * as readline from 'readline';
import { Asset } from './asset';
import { AssetInformation } from './asset-information';
import { Person } from './person';
import { resolve } from 'url';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const assetList: Asset[] = [];
let counter = 1;

(async () => {

  let choice = 0;
  while (choice !== 4) {
    choice = await showMainMenu();
    switch (choice) {
      case 1:
        console.log('Creating asset...');
        createAsset();
        break;
      case 2:
        console.log('Managing assets...');
        await manageAssets();
        break;
      case 3:
        console.log('Listing assets...');
        listAssets();
        break;
      case 4:
        console.log('Exiting...');
        process.exit(0);
        break;
      default:
        break;
    }
  }
})();

function createAsset() {
  const assInfo = new AssetInformation(counter);
  counter++;
  assInfo.assetName = 'Asset ' + assInfo.assetId;

  const tempAsset = new Asset(assInfo);
  assetList.push(tempAsset);
}

function listAssets() {
  for (const asset of assetList) {
    let data = '';
    data += asset.assetData.assetId + ' : ';
    data += asset.assetData.assetName + ' : ';

    if (!!asset.assetData.owner) {
      data += asset.assetData.owner.emailAddress + ' : ';
    }

    data += asset.assetState;

    console.log(data);
  }
}

async function showMainMenu(): Promise<number> {
  let choice = 0;
  console.log('\nAsset Manager v1');

  do {

    choice = await new Promise<number>(resolve => {
      rl.question('Menu : (1) Create Asset  (2) Manage Asset  (3) List Assets  (4) Exit: ', (answer) => {
        const ch = answer;
        const result = parseInt(ch, 10);
        resolve(result);
      });
    });

    console.log('');

  } while (choice < 1 || choice > 4);

  return choice;
}

async function manageAssets(): Promise<void> {

  listAssets();

  console.log('\nSelect asset to manage.');

  const assetId = await new Promise<number>(resolve => {
    rl.question('Asset Id: ', (answer) => {
      resolve(parseInt(answer, 10));
    });
  });

  const valid: string = 'ABCDEFGHIJK';

  if (isAssetExist(assetId)) {
    let choice = 'X';
    console.log('Asset Management');

    do {

      console.log('');

      choice = await new Promise<string>(resolve => {
        rl.question('Menu : (A) Test (B) Assign (C) Repair (D) Upgrade (E) Release (F) Transfer (G) Repaired (H) Discard (I) Lost (J) Found (K) Exit: ', (answer) => {
          resolve(answer.toUpperCase());
        });
      });

    } while (!valid.includes(choice));

    const asset = assetList.find(i => i.assetData.assetId === assetId);

    if (choice === 'K') {
      console.log('Exiting asset management.');
      console.log();
      console.log(asset!.getDOTGraph());

    } else {
      await manageAsset(asset!, choice);
    }
  } else {
    console.log('Asset not found.');
  }
}

async function manageAsset(asset: Asset, action: string): Promise<any> {
  switch (action) {
    case 'A': await asset.finishedTesting(); break;
    case 'B': await asset.assign(await getOwner()); break;
    case 'C': await asset.requestRepair(); break;
    case 'D': await asset.requestUpdate(); break;
    case 'E': await asset.release(); break;
    case 'F': await asset.transfer(await getOwner()); break;
    case 'G': await asset.repaired(); break;
    case 'H': await asset.discard(); break;
    case 'I': await asset.lost(); break;
    case 'J': await asset.found(); break;
    default: break;
  }

  console.log(`Success : ${asset.isSuccessful}`);
}

function getOwner(): Promise<Person> {
  const id = counter;

  return new Promise<Person>(resolve => {
    rl.question('Enter name: ', (answer) => {
      const name = answer;
      const email = name.replace(' ', '') + '@email.com';
      counter++;
      resolve(new Person(id, name, email));
    });
  });
}

function isAssetExist(assetId: number): boolean {
  return !!assetList.find(i => i.assetData.assetId === assetId);
}
