import { IncrementSecret } from "./IncrementSecret.js";
import {
    isReady,
    shutdown,
    Field,
    Mina,
    PrivateKey,
    AccountUpdate,
    Poseidon,
} from 'snarkyjs';

(async function main() {
    // Wait for SnarkyJS to be ready
    await isReady;
    console.log('SnarkyJS is ready!');

    // Set up a local blockchain
    const Local = Mina.LocalBlockchain();
    Mina.setActiveInstance(Local);
    const deployerAccount = Local.testAccounts[0].privateKey;

    const zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();

    // Generate the salf used for shielding the secret
    const salt = Field.random();

    // Deploy the contract
    const contract = new IncrementSecret(zkAppAddress);
    const deployTxn = await Mina.transaction(deployerAccount, () => {
        AccountUpdate.fundNewAccount(deployerAccount);

        contract.deploy({ zkappKey: zkAppPrivateKey });
        contract.initialize(salt, Field(100));
        contract.requireSignature();
    });
    await deployTxn.sign([zkAppPrivateKey]).send();

    console.log('Deployed and initialized contract ', deployTxn.toPretty());

    // Increment the secret
    const incrementTxn = await Mina.transaction(deployerAccount, () => {
        contract.incrementSecret(salt, Field(100));
        contract.requireSignature();
    });
    await incrementTxn.sign([zkAppPrivateKey]).send();

    console.log('Incremented secret ', incrementTxn.toPretty());

    // Check if the secret was incremented
    const incrementedSecret = Poseidon.hash([salt, Field(101)]);
    const stateSecret = contract.x.get();
    console.log('state after increment:', stateSecret.toString());
    console.log('expected state after increment:', incrementedSecret.toString());
    stateSecret.assertEquals(stateSecret);

    await shutdown();
})();