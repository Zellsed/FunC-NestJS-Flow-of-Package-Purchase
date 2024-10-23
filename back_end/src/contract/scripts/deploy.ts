import { address, beginCell, Cell, toNano } from 'ton-core';
import { TonContract } from '../wrappers/TonContract';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
  const codeCell = await compile('TonContract');

  const myContract = TonContract.createFormconfig(
    {
      id: 0,
      name: beginCell().storeStringTail('Basic Package').endCell(),
      price: toNano('0.05'),
      description: beginCell().storeStringTail('The Basic Package.').endCell(),
      duration: 1,
      recent_sender: address(
        '0QALzUOdlNz4w3Nq1bctEFhxeuVZRBTE7xuSLDRJl2ox9CRH',
      ),
      owner_address: address(
        '0QALzUOdlNz4w3Nq1bctEFhxeuVZRBTE7xuSLDRJl2ox9CRH',
      ),
    },
    codeCell,
  );

  const openContract = provider.open(myContract);

  console.log('provider', provider);

  openContract.sendDeploy(provider.sender(), toNano('0.05'));

  await provider.waitForDeploy(myContract.address);
}
