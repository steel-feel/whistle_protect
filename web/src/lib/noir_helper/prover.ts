import { UltraHonkBackend } from "@aztec/bb.js";
import { Noir, type InputMap } from "@noir-lang/noir_js";
import type { InputValue, } from "@noir-lang/noirc_abi";
import { generateEmailVerifierInputs } from "@zk-email/zkemail-nr"
import circuit from "./whistle_protect_contract.json"

type ProvingBackend = "honk" | "plonk" | "all";

export class ZKEmailProver {
  private honk?: UltraHonkBackend;

  private noir: Noir;

  constructor(
    /* The ACIR of the Noir circuit to prove */
    // circuit: CompiledCircuit,
    /* Define the prover backend to use */
    private provingBackend: ProvingBackend = "plonk",
    /* Threads to use */
    private threads: number = 4
  ) {
    try {
      console.log("Circuit bytecode length:", circuit.bytecode?.length || "undefined");
      console.log("Circuit bytecode type:", typeof circuit.bytecode);

      // initialize the backends
      if (provingBackend === "honk" || provingBackend === "all") {
        console.log("Initializing Honk backend...");
        if (!circuit.bytecode) {
          throw new Error("Circuit bytecode is undefined");
        }
        this.honk = new UltraHonkBackend(circuit.bytecode, { threads: this.threads });
        console.log("Honk backend initialized successfully");
      }
      // initialize the Noir instance
      console.log("Initializing Noir instance...");
      //@ts-ignore
      this.noir = new Noir(circuit);
      console.log("Noir instance initialized successfully");
    } catch (error) {
      console.error("Error initializing ZKEmailProver:", error);
      console.error("Error stack:", error.stack);
      throw new Error(`Failed to initialize ZKEmailProver: ${error.message}`);
    }
  }

  /**
   * Compute the witness for a given input to the circuit without generating a proof
   *
   * @param input - the input that should produce a satisfying witness for the circuit
   * @returns - the witness for the input and the output of the circuit if satisfiable
   */
  async simulateWitness(
    input: InputMap
  ): Promise<{ witness: Uint8Array; returnValue: InputValue }> {
    return this.noir.execute(input);
  }

  async generateVk() {
    switch (this.provingBackend) {
      case "honk":
        return await this.honk?.getVerificationKey()
        break;
    }


  }

  /**
   * Generate a proof of a satisfying input to the circuit using a provided witness
   *
   * @param input - a satisfying witness for the circuit
   * @param provingBackend - optionally provided if the class was initialized with both proving schemes
   * @returns proof of valid execution of the circuit
   */
  async prove(
    witness: Uint8Array,
    provingBackend?: ProvingBackend
  ): Promise<any> {
    // determine proving backend to use
    let backend: UltraHonkBackend;
  if (
      (provingBackend === "honk" && this.honk) ||
      (this.provingBackend === "honk" && this.honk)
    ) {
      backend = this.honk;
    } else {
      throw new Error(`Proving scheme ${this.provingBackend} not initialized`);
    }

    // generate the proof
    return backend.generateProof(witness);
  }

  /**
   * Simulate the witness for a given input and generate a proof
   *
   * @param input - the input that should produce a satisfying witness for the circuit
   * @param provingBackend - optionally provided if the class was initialized with both proving schemes
   * @returns proof of valid execution of the circuit
   */
  async fullProve(
    input: InputMap,
    provingBackend?: ProvingBackend
  ): Promise<any> {
    const { witness } = await this.simulateWitness(input);
    return this.prove(witness, provingBackend);
  }

  /**
   * Verify a proof of a satisfying input to the circuit for a given proving scheme
   *
   * @param proof - the proof to verify
   * @param provingBackend - optionally provided if the class was initialized with both proving schemes
   * @returns true if the proof is valid, false otherwise
   */
  async verify(
    proof: any,
    provingBackend?: ProvingBackend
  ): Promise<boolean> {
    // determine proving backend to use
    let backend: UltraHonkBackend ;
   if (
      (provingBackend === "honk" && this.honk) ||
      (this.provingBackend === "honk" && this.honk)
    ) {
      backend = this.honk;
    } else {
      throw new Error(`Proving scheme ${this.provingBackend} not initialized`);
    }
    // verify the proof
    return backend.verifyProof(proof);
  }

  /**
   * End the prover wasm instance(s) and clean up resources
   */
  async destroy() {
    if (this.honk) {
      await this.honk.destroy();
    }
  }
}

export async function generateInputs(emlfile: any) {
  const inputParams = {
    extractFrom: true,
    extractTo: true,
    maxHeadersLength: 1024,
    maxBodyLength: 1024,
  };
  return await generateEmailVerifierInputs(
    emlfile,
    inputParams
  );
}