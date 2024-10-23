import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from 'ton-core';

export type TonContractConfig = {
  id: number;
  name: Cell;
  price: bigint;
  description: Cell;
  duration: number;
  recent_sender: Address;
  owner_address: Address;
};

export function tonContractConfigToCell(config: TonContractConfig): Cell {
  return beginCell()
    .storeUint(config.id, 32)
    .storeRef(config.name)
    .storeUint(config.price, 32)
    .storeRef(config.description)
    .storeUint(config.duration, 32)
    .storeAddress(config.recent_sender)
    .storeAddress(config.owner_address)
    .endCell();
}

export class TonContract implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFormconfig(
    config: TonContractConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = tonContractConfigToCell(config);
    const init = { code, data };
    const address = contractAddress(workchain, init);

    return new TonContract(address, init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendBuyPackage(
    provider: ContractProvider,
    sender: Sender,
    value: bigint,
    id: number,
    name: Cell,
    price: bigint,
    description: Cell,
    duration: number,
  ) {
    const msg_body = beginCell()
      .storeUint(1, 32)
      .storeUint(id, 32)
      .storeRef(name)
      .storeUint(price, 32)
      .storeRef(description)
      .storeUint(duration, 32)
      .endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async sendDeposit(provider: ContractProvider, sender: Sender, value: bigint) {
    const msg_body = beginCell().storeUint(2, 32).endCell();

    await provider.internal(sender, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: msg_body,
    });
  }

  async getData(provider: ContractProvider) {
    const { stack } = await provider.get('get_contract_storage_data', []);

    return {
      id: stack.readNumber(),
      name: stack.readCell(),
      price: stack.readNumber(),
      description: stack.readCell(),
      duration: stack.readNumber(),
      recent_sender: stack.readAddress(),
      owner_address: stack.readAddress(),
    };
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get('balance', []);

    return {
      balance: stack.readNumber(),
    };
  }
}
