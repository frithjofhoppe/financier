export enum MovementDirection {
  DEBIT = 'DEBIT', CREDIT = 'CREIDT'
}

export interface AccountMovement {
  id: number;
  value: string;
  valuata: string;
  description: string;
  tag: Tag;
}

export interface Tag {
  id: number;
  identifier: string;
}

export interface User {
  id: number;
  auth0Id: string;
  email: string;
  name: string;
  avatar: string;
}
