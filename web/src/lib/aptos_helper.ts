import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { aptos, moduleAddress } from "./constants";

const alicePvtKey = new Ed25519PrivateKey(import.meta.env.PUBLIC_ALICE_PVT_KEY); 
const verifierPrivateKey = new Ed25519PrivateKey( import.meta.env.PUBLIC_VERIFIER_PVT_KEY );

const verifier = Account.fromPrivateKey({ privateKey: verifierPrivateKey })
const alice = Account.fromPrivateKey({ privateKey: alicePvtKey });


export async function makeTxn(data, accountAddr) {
     const payload = {
      function: `${moduleAddress}::smart_table::get_messages_len`,
      typeArguments: [], // No type arguments for this function
      functionArguments: [], // The address to check the balance of
    };
    
    const result = await aptos.view({
        //@ts-ignore
        payload,
    });
   
    //@ts-ignore
    const len = parseInt(result[0]);

    const sno = len+1;

    const transaction = await aptos.transaction.build.multiAgent({
        sender: accountAddr,
        secondarySignerAddresses: [verifier.accountAddress],
        withFeePayer: true,
        data: {
            // REPLACE WITH YOUR MULTI-AGENT FUNCTION HERE
            function: `${moduleAddress}::smart_table::add_entry`,
            // Pass in arguments for the function you specify above
            functionArguments: [sno, JSON.stringify(data)],
        },
    });

    return transaction
}

export async function doTx(aliceSenderAuthenticator:any,  transaction : any) {
     // Bob is a secondary signer for this transaction
    const verifierSenderAuthenticator = aptos.transaction.sign({
        signer: verifier,
        transaction: transaction,
    });

    //fee payer
    const feePayerAuthenticator = aptos.transaction.signAsFeePayer({
        signer: verifier,
        transaction: transaction,
    });

    const committedTransaction = await aptos.transaction.submit.multiAgent({
        transaction: transaction,
        senderAuthenticator: (await aliceSenderAuthenticator).authenticator,
        additionalSignersAuthenticators: [verifierSenderAuthenticator],
        feePayerAuthenticator
    });

    const executedTransaction = await aptos.waitForTransaction({
        transactionHash: committedTransaction.hash,
    });

    console.log("Txn done");
    return executedTransaction.hash
}