import { Address } from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import swampABI from "../statics/abis/LPStakingABI.json";
import { CONTRACT } from "../statics/addresses";

export default function useClaim() {
  const preparation = usePrepareContractWrite({
    address: CONTRACT as Address,
    abi: swampABI,
    functionName: "getReward",
    args: [true],
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
  });

  return { confirmation, transaction };
}
