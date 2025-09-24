# Whistle Protect

- Track: [3 - Consumer and Others]
- Team No. - 54
- Team name. - stack_too_deep


## Description

A private and secure whistleblowing platform using zk email verification and onchain attestations to ensure source credibility without compromising anonymity.A cutting edge cryptographic infrastructure to free the truth With ZK Proofs we don't have to choose between anonimity and credibility anymore. We can have both. We can have truth.

## Problem

Most anonymous reporting platforms rely on central servers, lack cryptographic verification, and expose whistleblowers to surveillance or metadata leaks. Without decentralized trust or ZK-based guarantees, both source safety and information integrity are at risk.

## Solution
Using zero-knowledge email proofs, we verify source legitimacy (e.g., domain or role-based credentials) without exposing identity. Blockchain attestations anchor evidence onchain with tamper-proof audit trails. This enables transparency: sources can selectively disclose credentials while maintaining full anonymity.

### Real-World Use Cases

- Corporate insiders can prove access to internal systems or domains without revealing identity
- Verified legal and journalist-only forums can receive sensitive documents anonymously
- Newsrooms can now trust anonymous sources with added layer of credibility
- Vulnerable individuals can safely disclose important information without fear of retaliation

## Project Folder Structure
- *web* : Frontend Web app
- *souces* : Aptos contracts

## Usage 

> Required , aptos cli and pnpm 

### Compile contracts

```bash
aptos move complile
```

### Deploy contract

 1. Init the Accounts related to contract, which should create `config.yaml` file under .aptos folder at project root
 ```bash
aptos init
 ```

 2. Deploy

 ```bash
aptos move publish --named-addresses whistle_protect=default
 ```

 3. Run webapp
> set PUBLIC_VERIFIER_PVT_KEY = "0x .. . " at enviorment
```bash
cd web && pnpm i && pnpm run dev
```


