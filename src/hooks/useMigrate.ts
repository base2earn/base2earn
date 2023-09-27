import { Address } from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import contractABI from "../statics/abis/contractABI.json";
import { BRB_ADDRESS } from "../statics/addresses";
import useFirework from "@/src/hooks/useFireworks";

export default function useMigrate(amount: BigInt, enabled: boolean) {
  const { firework } = useFirework();

  const preparation = usePrepareContractWrite({
    address: BRB_ADDRESS as Address,
    abi: contractABI,
    enabled: enabled,
    functionName: "migrate",
    args: [amount],
    onError(err) {
      console.error(err);
    },
  });

  const transaction = useContractWrite({
    ...preparation.config,
    onError(err) {
      console.error(err);
    },
  });
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onError(error) {
      console.error(error);
    },
    onSuccess(data) {
      firework();
    },
  });

  return { confirmation, transaction };
}
