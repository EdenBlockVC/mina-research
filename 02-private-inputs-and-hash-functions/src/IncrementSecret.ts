import {
    Field,
    SmartContract,
    state,
    State,
    method,
    DeployArgs,
    Poseidon,
    Permissions,
} from 'snarkyjs';
  
export class IncrementSecret extends SmartContract { 
    @state(Field) x = State<Field>();

    deploy(args: DeployArgs) {
        super.deploy(args);
        this.setPermissions({
            ...Permissions.default(),
            editState: Permissions.proofOrSignature(),
        });
    }

    @method initialize(salt: Field, firstSecret: Field) { 
        this.x.set(Poseidon.hash([salt, firstSecret]));
    }

}
