import { Address } from "viem";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import swampABI from "../statics/abis/contractABI.json";
import { CONTRACT } from "../statics/addresses";

export default function useBurn(amountIn: BigInt, enabled: boolean) {
  const preparation = usePrepareContractWrite({
    address: CONTRACT as Address,
    abi: swampABI,
    enabled: enabled,
    functionName: "burn2earn",
    args: [amountIn],
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
