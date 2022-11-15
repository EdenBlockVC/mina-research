# Mina

## Methodology

I write in this journal while I am exploring the Mina Protocol. I am not an expert in this field, but I am a developer who is interested in learning more about the Mina Protocol. I am not affiliated with Mina in any way.

This is not a deep dive, but more of a quick journal of my experience with Mina. This journal is not meant to be a tutorial, but rather a quick reference for myself and others who may be interested in using Mina.

## Documentation

I started from the official documentation, specifically the Developer section:

https://docs.minaprotocol.com/zkapps

## Installation

Pretty easy to install

```sh
$ npm install -g zkapp-cli
```

Once that is done, I have access to the `zk` cli tool.

```sh
$ zk                 
Usage: zk <command> [options]

Commands:
  zk project [name]  Create a new project                     [aliases: proj, p]
  zk file [name]     Create a new file & test                       [aliases: f]
  zk config          Add a new deploy alias
  zk deploy [alias]  Deploy or redeploy a zkApp
  zk example [name]  Create an example project                      [aliases: e]
  zk system          Show system info                          [aliases: sys, s]

Options:
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]



    █▄ ▄█ █ █▄ █ ▄▀▄
    █ ▀ █ █ █ ▀█ █▀█

     Mina Protocol
      

Please provide a command.
```

I have to be honest, having a `zk system` command is pretty cool. I bet it's very useful to debug issues because you can can share all this information with the Mina team.

```sh
$ zk system          
Please include the following when submitting a Github issue:

  System:
    OS: macOS 13.0
    CPU: (10) x64 Apple M1 Max
  Binaries:
    Node: 14.17.6 - ~/.nvm/versions/node/v14.17.6/bin/node
    Yarn: 1.22.17 - /opt/homebrew/bin/yarn
    npm: 8.5.5 - ~/.nvm/versions/node/v14.17.6/bin/npm
  npmPackages:
    snarkyjs: Not Found (not in a project)
  npmGlobalPackages:
    zkapp-cli: 0.4.19

```

## Creating a project

I plan to finally have a contract or a system that implements a zk system that does anything as simple as possible. At the moment I want to be able to create a project, deploy it, and then interact with it.

I created a project called `tutorial`:

```sh
$ zk project tutorial
✔ UI: Set up project
✔ Initialize Git repo
✔ Set up project
✔ NPM install
✔ NPM build contract
✔ Set project name
✔ Git init commit

Success!

Next steps:
  cd tutorial
  git remote add origin <your-repo-url>
  git push -u origin main
```

Going into the project directory and running `zk config` outputs an error, even though this is what the documentation says to do:

```sh
$ cd tutorial
$ zk config
zk config

Add a new deploy alias

Options:
  -h, --help     Show help                                             [boolean]
  -v, --version  Show version number                                   [boolean]

TypeError: table(...).replaceAll is not a function
    at Object.config [as handler] (/Users/cleanunicorn/.nvm/versions/node/v14.17.6/lib/node_modules/zkapp-cli/src/lib/config.js:68:54)
```

I forked the `zkapp-cli` and checked the documentation. It seems that Node.JS version 16 is required. I updated my `.nvmrc` file and proceeded to reinstall the `zkapp-cli`. But this time from the local forked repository.

- Clone the `zkapp-cli` repo
- Clean up the global installation `npm uninstall -g zkapp-cli`
- Switch to Node.JS v16 `nvm use v16`
- Install the local repo

In the `zkapp-cli` fork:

```sh
# Install dependencies with Node.JS v16
$ npm i
# Link the local repo to the global installation
$ npm i -g .
```

- Switch to the tutorial and make sure I have access to the new `zk` cli tool

```sh
$ which zk
/Users/cleanunicorn/.nvm/versions/node/v16.18.1/bin/zk
$ ls -l $(which zk)
lrwxr-xr-x  1 cleanunicorn  staff  46 14 Nov 16:59 /Users/cleanunicorn/.nvm/versions/node/v16.18.1/bin/zk -> ../lib/node_modules/zkapp-cli/src/bin/index.js
```

Looks good to me 👍.

Once all this is done I run `zk config` once again and it works:

```sh
$ zk config

  ┌──────────────────────────────────┐
  │     Networks in config.json      │
  ├────────┬────────┬────────────────┤
  │ Name   │ Url    │ Smart Contract │
  ├────────┴────────┴────────────────┤
  │ None found                       │
  └──────────────────────────────────┘
  
Add a new network:
✔ Choose a name (can be anything): · mina-tutorial
✔ Set the Mina GraphQL API URL to deploy to: · https://proxy.berkeley.minaexplorer.com/graphql
✔ Set transaction fee to use when deploying (in MINA): · 0.1
✔ Create key pair at keys/mina-tutorial.json
✔ Add network to config.json

Success!

Next steps:
  - If this is a testnet, request tMINA at:
    https://faucet.minaprotocol.com/?address=B62qoQxnv1r7Cnk6mbAz99WgHnAqjqZigmR8UWQqgP44ubmoQp43ZnM
  - To deploy, run: `zk deploy mina-tutorial` 
```

Checking the config file we see the `config.json` file being updated to:

```json
{
  "version": 1,
  "networks": {
    "mina-tutorial": {
      "url": "https://proxy.berkeley.minaexplorer.com/graphql",
      "keyPath": "keys/mina-tutorial.json",
      "fee": "0.1"
    }
  }
}
```

A new key pair was created to use with this project. The format is fairly simple. I will redact the private key:

```json
{
  "privateKey": "REDACTED",
  "publicKey": "B62qoQxnv1r7Cnk6mbAz99WgHnAqjqZigmR8UWQqgP44ubmoQp43ZnM"
}
```

Once I go to the faucet provided URL, the address is prefilled into the form and I can request funds.

Pretty nice experience until now.

![faucet](./static/SCR-20221114-nuu.png)

Once the transaction is completed I am presented with a url to their explorer containing the transaction hash. If you're familiar to Etherscan, it feels like a similar experience.

https://berkeley.minaexplorer.com/transaction/CkpZ55skZPA2W4Kt9Abc62sZd7bUEd4NXLg56SgenRMWJu6q3MmMg

It seems there are 363 people who requested funds from this current address. Not sure if this means that ~363 people have gone trough the same process or the source address/process was changed over time.

![explorer](static/SCR-20221114-nwv.png)

After a while the [account page](https://berkeley.minaexplorer.com/wallet/B62qoQxnv1r7Cnk6mbAz99WgHnAqjqZigmR8UWQqgP44ubmoQp43ZnM) is update with the new balance:

![account](static/SCR-20221114-o2c.png)

I don't know why 50 tokens were sent and I only have 49, but I don't really care at the moment.

It seems I can deploy a contract right away:

```sh
$ zk deploy mina-tutorial
✔ Build project
✔ Generate build.json
✔ Choose smart contract
  Only one smart contract exists in the project: Add
  Your config.json was updated to always use this
  smart contract when deploying to this network.
⠋ Generate verification key (takes 10-30 sec)...
```

And I wait for a while, finally:

```sh
✔ Generate verification key (takes 10-30 sec)
✔ Build transaction
✔ Confirm to send transaction

  ┌────────────────┬─────────────────────────────────────────────────┐
  │ Network        │ mina-tutorial                                   │
  ├────────────────┼─────────────────────────────────────────────────┤
  │ Url            │ https://proxy.berkeley.minaexplorer.com/graphql │
  ├────────────────┼─────────────────────────────────────────────────┤
  │ Smart Contract │ Add                                             │
  └────────────────┴─────────────────────────────────────────────────┘
  
  Are you sure you want to send (yes/no)? · yes
✔ Send to network

Success! Deploy transaction sent.

Next step:
  Your smart contract will be live (or updated)
  as soon as the transaction is included in a block:
  https://berkeley.minaexplorer.com/transaction/CkpZsGEfQbTKcyV2hXKwwAgPQt99PA61gqsWgqgG3gJJHvGcny2g6
```

After a while the transaction was mined:

![image](static/SCR-20221114-o7i.png)

I've done all of this without ever knowing what contract I deployed. From the message above I figure out the contract is [`Add`](tutorial/src/Add.ts), so it seems a "simple" zero knowledge addition circuit.

I check the documentation and I see

> The project you just created contains an example smart contract named Add.ts that stores a number as on-chain state and adds 2 to it whenever a transaction is received by the zkApp account.

How do I interact with the contract now? No idea.

I check the contract source code before moving forward.

[Add.ts](tutorial/src/Add.ts)

```ts
import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
} from 'snarkyjs';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 * 
 * This file is safe to delete and replace with your own contract.
 */
export class Add extends SmartContract {
  @state(Field) num = State<Field>();

  deploy(args: DeployArgs) {
    super.deploy(args);
    this.setPermissions({
      ...Permissions.default(),
      editState: Permissions.proofOrSignature(),
    });
  }

  @method init() {
    this.num.set(Field(1));
  }

  @method update() {
    const currentState = this.num.get();
    this.num.assertEquals(currentState); // precondition that links this.num.get() to the actual on-chain state
    const newState = currentState.add(2);
    newState.assertEquals(currentState.add(2));
    this.num.set(newState);
  }
}
```

## Hello World

Moving forward to a more complex example, I continue with [`hello-world`](https://docs.minaprotocol.com/zkapps/tutorials/hello-world).

> We will write a basic smart contract that stores a number as on-chain state and contains logic to only allow this number to be replaced by its square (e.g. 2 -> 4 -> 16...). We will create this project using the Mina zkApp CLI, write our smart contract code, and then use a local Mina blockchain to interact with it.

More exciting. I will learn how to interact with the contract once deployed.

I check the version first to see how far I am from the tested documentation:

```sh
$ zk --version
0.4.19
```

Not too bad, the docs mention `0.4.17`.

I build a new project

```sh
$ zk project 01-hello-world
✔ UI: Set up project
✔ Initialize Git repo
✔ Set up project
✔ NPM install
✔ NPM build contract
✔ Set project name
✔ Git init commit

Success!

Next steps:
  cd 01-hello-world
  git remote add origin <your-repo-url>
  git push -u origin main

$ cd 01-hello-world/
```

Same as before.

### Preparation

I have to remove the example contract and start fresh.

```sh
$ rm Add.t*     
```

To generate a new file, I have to use the `zk` command:

```sh
$ zk file Square           
Created Square.ts
Created Square.test.ts
```

And I create a new `main.ts` file:

```sh
$ touch main.ts
```

In the [`src`](01-hello-world/src/) folder we have the files:

```sh
$ ls -l            
total 16
-rw-r--r--  1 cleanunicorn  staff  137 14 Nov 17:43 Square.test.ts
-rw-r--r--  1 cleanunicorn  staff    0 14 Nov 17:43 Square.ts
-rw-r--r--  1 cleanunicorn  staff   49 14 Nov 17:41 index.ts
-rw-r--r--  1 cleanunicorn  staff    0 14 Nov 17:45 main.ts
```

The file `main.ts` will be used to interact with the contract, and `index.ts` seems to load the application (but currently still points to the removed `Add` contract). No worries, I push forward.

I edit the `index.ts` file to load and export the `Square` contract:

```ts
import { Square } from './Square.js';

export { Square };
```

### Building and running

Trying to compile the project I get an error, which is expected because I don't implement the `Square` contract yet.

```sh
$ npm run build             

> 01-hello-world@0.1.0 build
> tsc -p tsconfig.json

src/index.ts:1:24 - error TS2306: File '/Users/cleanunicorn/Development/github.com/edenblockvc/mina-tutorial/01-hello-world/src/Square.ts' is not a module.

1 import { Square } from './Square.js';
                         ~~~~~~~~~~~~~

src/Square.ts:1:1 - error TS1208: 'Square.ts' cannot be compiled under '--isolatedModules' because it is considered a global script file. Add an import, export, or an empty 'export {}' statement to make it a module.

1 
  


Found 2 errors in 2 files.

Errors  Files
     1  src/index.ts:1
     1  src/Square.ts:1
```

Running can be done once the project was successfully built:

```sh
$ node build/src/main.js
```

Which right now gives no output because `main.ts` is empty.

I combine these 2 commands into one, so I edit [`package.json`](01-hello-world/package.json) to add a new command in the `scripts` section:

```json
"scripts": {
  ...
  "exec": "npm run build && node build/src/main.js"
},
```

Now I can run the project with `npm run exec`.


### Writing code

Continuing the documentation is really straightforward and, as up until this point, each question that appears in my mind is answered immediatelly.

While I was writing code I was kicked out of the coffee shop I was working at so I had to stop for a while. I will continue tomorrow.

---

Overnight an upgrade to the testnet is prepred so I need to upgrade `SnarkyJS 0.7.0` and `zkapp-cli 0.5.0`. 

![testnet upgrade](static/SCR-20221115-fx6.png)

I checked the [original repository](https://github.com/o1-labs/zkapp-cli) trying to find a tag for the 0.5.0 release, but the only thing that seemed relevant was the branch [bump-version-0.5.0](`https://github.com/o1-labs/zkapp-cli/tree/bump-version-0.5.0`) which currently has [failed checks for the latest commit](https://github.com/o1-labs/zkapp-cli/commit/0b5a520b672410e50e34b24041b29509ab6abfdf).

Until things become more clear, I can't see a way to upgrade the tools to the latest version.


