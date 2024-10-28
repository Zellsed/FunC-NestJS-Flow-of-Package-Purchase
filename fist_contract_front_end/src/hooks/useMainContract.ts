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
  const addressContract = "EQAhlgpsyQQGIeflmmotIOjW8Sy0Gpdf4cZEDKM8z3gtuwBg";

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
    const contract = new TonContract(Address.parse(addressContract));
    return client.open(contract) as OpenedContract<TonContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const balanceData = await mainContract.getBalance();

      setContractData({
        id: val.id,
        name: val.name,
        price: BigInt(val.price),
        description: val.description,
        duration: val.duration,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });

      setBalance(balanceData.balance);
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
      const walletObject = { wallet };
      const rawAddress = walletObject.wallet?.account?.address;

      if (!rawAddress) {
        console.error("Address is undefined");
        return;
      }

      const addressWallet = Address.parse(rawAddress);
      const addressContractDeploy = Address.parse(addressContract);

      const getBalance = await client?.getBalance(addressWallet);

      if (getBalance !== undefined && getBalance <= toNano(price)) {
        console.error("Not enough balance");
        return;
      }

      const lastTx = await client?.getTransactions(addressContractDeploy, {
        limit: 1,
      });

      if (!lastTx || !lastTx[0]) {
        console.error("No transaction found.");
        return;
      }

      const tx = lastTx[0];

      const transactionDetails = {
        address: tx.address?.toString() ?? "",
        lt: tx.lt?.toString() ?? "",
        now: tx.now ? new Date(tx.now * 1000).toISOString() : "",
        prevTransactionHash: tx.prevTransactionHash?.toString() ?? "",
        oldStatus: tx.oldStatus ?? "",
        totalFees: tx.totalFees?.coins?.toString() ?? "",
        endStatus: tx.endStatus?.toString() ?? "",
        description:
          tx.description?.type === "generic"
            ? tx.description.creditPhase?.credit?.coins
            : "N/A",
      };

      const txTransaction = transactionDetails;

      await mainContract?.sendBuyPackage(
        sender,
        toNano(price),
        id,
        beginCell().storeStringTail(name).endCell(),
        toNano(price),
        beginCell().storeStringTail(description).endCell(),
        duration
      );

      while (true) {
        await sleep(10000);

        const transLatest = await client?.getTransactions(
          addressContractDeploy,
          { limit: 1 }
        );

        if (!transLatest || !transLatest[0]) {
          console.error("No new transaction found.");
          break;
        }

        const txLatest = transLatest[0];

        const latestTrans = {
          address: txLatest.address?.toString() ?? "",
          lt: txLatest.lt?.toString() ?? "",
          now: txLatest.now ? new Date(txLatest.now * 1000).toISOString() : "",
          prevTransactionHash: txLatest.prevTransactionHash?.toString() ?? "",
          oldStatus: txLatest.oldStatus ?? "",
          totalFees: txLatest.totalFees?.coins?.toString() ?? "",
          endStatus: txLatest.endStatus?.toString() ?? "",
          description:
            txLatest.description?.type === "generic"
              ? txLatest.description.creditPhase?.credit?.coins
              : "N/A",
        };

        if (
          latestTrans.address === txTransaction.address &&
          latestTrans.description === txTransaction.description &&
          latestTrans.endStatus === txTransaction.endStatus &&
          latestTrans.lt === txTransaction.lt &&
          latestTrans.now === txTransaction.now &&
          latestTrans.prevTransactionHash ===
            txTransaction.prevTransactionHash &&
          latestTrans.oldStatus === txTransaction.oldStatus &&
          latestTrans.totalFees === txTransaction.totalFees
        ) {
          console.log(
            "The transaction was not successful. Please check the transaction again."
          );
          break;
        }

        await axios.post("http://localhost:3000/ton/buyPackage", {
          wallet,
          id,
          name,
          price,
          description,
          duration,
        });

        console.log("Data has been updated in the backend and database.");
        break;
      }
    },

    sendDeposit: async (amount: string) => {
      const walletObject = { wallet };
      const rawAddress = walletObject.wallet?.account?.address;

      if (!rawAddress) {
        console.error("Address is undefined");
        return;
      }

      const addressWallet = Address.parse(rawAddress);
      const addressContractDeploy = Address.parse(addressContract);

      const getBalance = await client?.getBalance(addressWallet);

      if (getBalance !== undefined && getBalance <= toNano(amount)) {
        console.error("Not enough balance");
        return;
      }

      const lastTx = await client?.getTransactions(addressContractDeploy, {
        limit: 1,
      });

      if (!lastTx || !lastTx[0]) {
        console.error("No transaction found.");
        return;
      }

      const tx = lastTx[0];

      const transactionDetails = {
        address: tx.address?.toString() ?? "",
        lt: tx.lt?.toString() ?? "",
        now: tx.now ? new Date(tx.now * 1000).toISOString() : "",
        prevTransactionHash: tx.prevTransactionHash?.toString() ?? "",
        oldStatus: tx.oldStatus ?? "",
        totalFees: tx.totalFees?.coins?.toString() ?? "",
        endStatus: tx.endStatus?.toString() ?? "",
        description:
          tx.description?.type === "generic"
            ? tx.description.creditPhase?.credit?.coins
            : "N/A",
      };

      const txTransaction = transactionDetails;

      await mainContract?.sendDeposit(sender, toNano(amount));

      while (true) {
        await sleep(10000);

        const transLatest = await client?.getTransactions(
          addressContractDeploy,
          { limit: 1 }
        );

        if (!transLatest || !transLatest[0]) {
          console.error("No new transaction found.");
          break;
        }

        const txLatest = transLatest[0];

        const latestTrans = {
          address: txLatest.address?.toString() ?? "",
          lt: txLatest.lt?.toString() ?? "",
          now: txLatest.now ? new Date(txLatest.now * 1000).toISOString() : "",
          prevTransactionHash: txLatest.prevTransactionHash?.toString() ?? "",
          oldStatus: txLatest.oldStatus ?? "",
          totalFees: txLatest.totalFees?.coins?.toString() ?? "",
          endStatus: txLatest.endStatus?.toString() ?? "",
          description:
            txLatest.description?.type === "generic"
              ? txLatest.description.creditPhase?.credit?.coins
              : "N/A",
        };

        if (
          latestTrans.address === txTransaction.address &&
          latestTrans.description === txTransaction.description &&
          latestTrans.endStatus === txTransaction.endStatus &&
          latestTrans.lt === txTransaction.lt &&
          latestTrans.now === txTransaction.now &&
          latestTrans.prevTransactionHash ===
            txTransaction.prevTransactionHash &&
          latestTrans.oldStatus === txTransaction.oldStatus &&
          latestTrans.totalFees === txTransaction.totalFees
        ) {
          console.log(
            "The transaction was not successful. Please check the transaction again."
          );
          break;
        }

        await axios.post("http://localhost:3000/ton/deposit", {
          wallet,
          amount,
        });

        console.log("Data has been updated in the backend and database.");
        break;
      }
    },
  };
}
