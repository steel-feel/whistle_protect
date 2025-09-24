import { Account, Ed25519PrivateKey } from "@aptos-labs/ts-sdk";
import { aptos, moduleAddress } from "./constants";

const alicePvtKey = new Ed25519PrivateKey("ed25519-priv-0xe1b9dd5095acb6fd2a74c34300616fb1929afcd5d95bc2f3bbb22fd0af9389b5");
const verifierPrivateKey = new Ed25519PrivateKey("ed25519-priv-0x90d8602e09249b77daceea75bcdfe557a98f03548ef23fd1999bcff3044de16e");

const verifier = Account.fromPrivateKey({ privateKey: verifierPrivateKey })
const alice = Account.fromPrivateKey({ privateKey: alicePvtKey });

export async function doTxn(data) {

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

    const transaction2 = await aptos.transaction.build.multiAgent({
        sender: alice.accountAddress,
        secondarySignerAddresses: [verifier.accountAddress],
        withFeePayer: true,
        data: {
            // REPLACE WITH YOUR MULTI-AGENT FUNCTION HERE
            function: `${moduleAddress}::smart_table::add_entry`,
            // Pass in arguments for the function you specify above
            functionArguments: [sno, JSON.stringify(data)],
        },
    });


    const aliceSenderAuthenticator = aptos.transaction.sign({
        signer: alice,
        transaction: transaction2,
    });
    // Bob is a secondary signer for this transaction
    const verifierSenderAuthenticator = aptos.transaction.sign({
        signer: verifier,
        transaction: transaction2,
    });

    //fee payer
    const feePayerAuthenticator = aptos.transaction.signAsFeePayer({
        signer: verifier,
        transaction: transaction2,
    });

    const committedTransaction = await aptos.transaction.submit.multiAgent({
        transaction: transaction2,
        senderAuthenticator: aliceSenderAuthenticator,
        additionalSignersAuthenticators: [verifierSenderAuthenticator],
        feePayerAuthenticator
    });

    const executedTransaction = await aptos.waitForTransaction({
        transactionHash: committedTransaction.hash,
    });

    console.log("Txn done");
    return sno + ""
}