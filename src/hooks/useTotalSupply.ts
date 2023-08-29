import { erc20ABI, useContractRead } from "wagmi";
import { formatEther } from "viem";
import { CHAIN_ID, B2E_ADDRESS } from "../statics/addresses";

export default function useTotalSupply() {
  const { data } = useContractRead({
    abi: erc20ABI,
    address: B2E_ADDRESS,
    functionName: "totalSupply",
    chainId: CHAIN_ID,
    watch: true,
  });

  return data ? Number(formatEther(data as bigint)) : 0;
}
