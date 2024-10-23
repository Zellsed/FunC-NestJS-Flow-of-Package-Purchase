import { useEffect, useState } from "react";
import { TonContract } from "../contracts/TonContract";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, beginCell, Cell, OpenedContract } from "ton-core";
import { toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";
import axios from "axios";

export function useMainContract() {
  const client = useTonClient();
  const { sender, wallet } = useTonConnect();

  const sleep = (time: number) =>
    new Promise((resolve) => setTimeout(resolve, time));

  const [contractData, setContractData] = useState<null | {
    id: number;
    name: Cell;
    price: bigint;
    description: Cell;
    duration: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [balance, setBalance] = useState<null | number>(0);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new TonContract(
      Address.parse("EQAhlgpsyQQGIeflmmotIOjW8Sy0Gpdf4cZEDKM8z3gtuwBg")
    );
    return client.open(contract) as OpenedContract<TonContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const { balance } = await mainContract.getBalance();

      setContractData({
        id: val.id,
        name: val.name,
        price: BigInt(val.price),
        description: val.description,
        duration: val.duration,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });

      setBalance(balance);
      await sleep(5000);
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    ...contractData,

    sendBuyPackage: async (
      id: number,
      name: string,
      price: string,
      description: string,
      duration: number
    ) => {
      await axios.post("http://localhost:3000/ton/buyPackage", {
        wallet,
        id,
        name,
        price,
        description,
        duration,
      });

      return await mainContract?.sendBuyPackage(
        sender,
        toNano(price),
        Number(id),
        beginCell().storeStringTail(name).endCell(),
        toNano(price),
        beginCell().storeStringTail(description).endCell(),
        Number(duration)
      );
    },

    sendDeposit: async (amount: string) => {
      await axios.post("http://localhost:3000/ton/deposit", { wallet, amount });

      return await mainContract?.sendDeposit(sender, toNano(amount));
    },
  };
}
