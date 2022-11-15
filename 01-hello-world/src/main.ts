import { Square } from './Square.js';
import {
    isReady,
    shutdown,
    Field,
    Mina,
    PrivateKey,
    AccountUpdate,
} from 'snarkyjs';

(async function main() {
    await isReady;

    console.log('SnarkyJS is ready!');

    const Local = Mina.LocalBlockchain();
    Mina.setActiveInstance(Local);
    const deployerAccount = Local.testAccounts[0].privateKey;

    const zkAppPrivateKey = PrivateKey.random();
    const zkAppAddress = zkAppPrivateKey.toPublicKey();

    const contract = new Square(zkAppAddress);
    const deployTxn = await Mina.transaction(deployerAccount, () => {
        // It seems the initial test accounts don't have enough funds to deploy a contract.
        AccountUpdate.fundNewAccount(deployerAccount);

        contract.deploy({ zkappKey: zkAppPrivateKey });
        contract.init();
        contract.sign(zkAppPrivateKey);
    });
    await deployTxn.send().wait();

    const num0 = contract.num.get();
    console.log('state after init:', num0.toString());

    // Square the number
    const txn1 = await Mina.transaction(deployerAccount, () => {
        contract.update(Field(9));
        contract.sign(zkAppPrivateKey);
    });
    await txn1.send().wait();

    // Check the new state
    const num1 = contract.num.get();
    console.log('state after update:', num1.toString());

    // Square the number again
    const txn2 = await Mina.transaction(deployerAccount, () => {
        contract.update(Field(81));
        contract.sign(zkAppPrivateKey);
    });
    await txn2.send().wait();

    // Check the new state
    const num2 = contract.num.get();
    console.log('state after second update:', num2.toString());

    // Send an invalid state update
    const txn3 = await Mina.transaction(deployerAccount, () => {
        contract.update(Field(100));
        contract.sign(zkAppPrivateKey);
    });
    await txn3.send().wait();

    // Check the new state
    const num3 = contract.num.get();
    console.log('state after third update:', num3.toString());    

    console.log('Shutting down...');

    await shutdown();
})();