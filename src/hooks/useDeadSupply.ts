import { useAccount, useBalance } from "wagmi";
import { DEAD_ADDRESS, B2E_ADDRESS } from "../statics/addresses";

export default function useDeadSupply() {
  const { data } = useBalance({
    address: DEAD_ADDRESS,
    token: B2E_ADDRESS,
    watch: true,
  });
  return data;
}
