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

    
}