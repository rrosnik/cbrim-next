import type { IConstraint } from "../types";

export class Constraint implements IConstraint {
  dof;
  name;
  node;
  ref_value;

  constructor(constraint: IConstraint) {
    this.dof = constraint.dof;
    this.name = constraint.name;
    this.node = constraint.node;
    this.ref_value = constraint.ref_value;
  }
}
