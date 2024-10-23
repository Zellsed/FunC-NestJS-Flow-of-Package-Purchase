import { useTonConnectUI } from "@tonconnect/ui-react";
import { Sender, SenderArguments } from "ton-core";

interface Wallet {
  account?: {
    address: string;
  };
}

export const useTonConnect = (): {
  sender: Sender;
  connected: boolean;
  wallet?: Wallet;
} => {
  const [tonConnectUI] = useTonConnectUI();

  return {
    sender: {
      send: async (args: SenderArguments) => {
        await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000,
        });
      },
    },
    connected: tonConnectUI.connected,
    wallet: tonConnectUI.wallet as Wallet,
  };
};
