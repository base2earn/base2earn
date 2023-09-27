import { Address, useAccount, useContractRead } from "wagmi";
import { formatEther, parseEther, zeroAddress } from "viem";
import { CONTRACT } from "../statics/addresses";
import contractABI from "../statics/abis/contractABI.json";

export default function useTotalSupply() {
  const { data } = useContractRead({
    address: CONTRACT,
    abi: contractABI,
    functionName: "totalSupply",
    args: [],
    watch: true,
  });

  return data ? formatEther(data as any as bigint) : 0;
}
