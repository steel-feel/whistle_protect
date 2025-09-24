import {
    Aptos,
    AptosConfig,
    Network,
} from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.DEVNET });
export const aptos = new Aptos(config);

export const moduleAddress = "0xcb49156fed2d8cd531a40747286969d6d1a7679e9e8e39ac6104b473640c4429"