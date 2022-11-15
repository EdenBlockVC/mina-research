import {
  Field,
  SmartContract,
  state,
  State,
  method,
  DeployArgs,
  Permissions,
} from 'snarkyjs';
  
export class Square extends SmartContract { 
    @state(Field) num = State<Field>();

    deploy(args: DeployArgs) {
        super.deploy(args);
        this.setPermissions({
            ...Permissions.default(),
            editState: Permissions.proofOrSignature(),
        });
    }

    @method init() {
        this.num.set(Field(3));
    }

    @method update(square: Field) {
        const currentNum = this.num.get();
        this.num.assertEquals(currentNum);
        square.assertEquals(currentNum.mul(currentNum));
        this.num.set(square);
    }

}