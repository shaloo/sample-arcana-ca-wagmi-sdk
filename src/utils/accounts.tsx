import {
    useAccount,
    useDisconnect,
    useEnsName,
    useSwitchChain,
// useSendTransaction //Do not use from wagmi SDK
} from "wagmi";
import {
    useBalance,
    useSendTransaction, //Note: Use from ca-wagmi SDK
    useWriteContract,
    useUnifiedBalance,
} from "@arcana/ca-wagmi";

import { useState } from "react";
import Decimal from "decimal.js";
import { erc20Abi } from "viem";

   