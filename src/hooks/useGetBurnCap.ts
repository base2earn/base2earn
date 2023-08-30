import { useContractRead } from "wagmi";
import contractABI from "../statics/abis/contractABI.json";
import { formatEther } from "viem";
import { CHAIN_ID, CONTRACT } from "../statics/addresses";

export default function useGetBurnCap() {
  const { data } = useContractRead({
    abi: contractABI,
    address: CONTRACT,
    functionName: "getBurnCap",
    chainId: CHAIN_ID,
    watch: true,
  });

  return data ? Number(formatEther(data as bigint)) : 0;
}
