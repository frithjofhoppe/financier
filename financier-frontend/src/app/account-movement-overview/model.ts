export enum MovementDirection {
  DEBIT = 'DEBIT', CREDIT = 'CREIDT'
}

export interface AccountMovement {
  id: number;
  value: number;
  valuata: string;
  movementDirection: MovementDirection;
  description: string;
}
