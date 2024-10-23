import { beginCell, Cell, toNano } from 'ton-core';
import {
  Blockchain,
  SandboxContract,
  TreasuryContract,
} from '@ton-community/sandbox';
import { TonContract } from '../wrappers/TonContract';

import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('TonContract', () => {
  let blockchain: Blockchain;
  let myContract: SandboxContract<TonContract>;
  let initWallet: SandboxContract<TreasuryContract>;
  let ownerWallet: SandboxContract<TreasuryContract>;
  let codeCell: Cell;

  beforeAll(async () => {
    codeCell = await compile('TonContract');
  });

  beforeEach(async () => {
    blockchain = await Blockchain.create();

    initWallet = await blockchain.treasury('initWallet');
    ownerWallet = await blockchain.treasury('ownerWallet');

    myContract = blockchain.openContract(
      TonContract.createFormconfig(
        {
          id: 1,
          name: beginCell().storeStringTail('Basic Package').endCell(),
          price: toNano('0.05'),
          description: beginCell()
            .storeStringTail('The Basic Package.')
            .endCell(),
          duration: 1,
          recent_sender: initWallet.address,
          owner_address: ownerWallet.address,
        },
        codeCell,
      ),
    );
  });

  it('Successfully deposits funds', async () => {
    const senderWallet = await blockchain.treasury('sender');

    const depositMessageResult = await myContract.sendDeposit(
      senderWallet.getSender(),
      toNano('45'),
    );

    expect(depositMessageResult.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: true,
    });

    const balance = await myContract.getBalance();

    expect(balance.balance).toBeGreaterThan(toNano('44.99'));
  });

  it('Successfully buy Package', async () => {
    const senderWallet = await blockchain.treasury('sender');

    const buyPackage = await myContract.sendBuyPackage(
      senderWallet.getSender(),
      toNano('0.05'),
      1,
      beginCell().storeStringTail('Basic Package').endCell(),
      toNano('0.05'),
      beginCell().storeStringTail('The Basic Package.').endCell(),
      1,
    );

    expect(buyPackage.transactions).toHaveTransaction({
      from: senderWallet.address,
      to: myContract.address,
      success: true,
    });

    const data = await myContract.getData();
    const balance = await myContract.getBalance();

    const nameSlice = data.name.beginParse();
    const decodedName = nameSlice.loadStringTail();

    const desSlice = data.description.beginParse();
    const decodedDes = desSlice.loadStringTail();

    expect(data.recent_sender.toString()).toBe(senderWallet.address.toString());
    expect(data.id).toEqual(1);
    expect(decodedName).toEqual('Basic Package');
    expect(decodedDes).toEqual('The Basic Package.');
    expect(data.price).toEqual(Number(toNano('0.05')));
    expect(balance.balance).toBeGreaterThan(toNano('0.048'));
  });
});
