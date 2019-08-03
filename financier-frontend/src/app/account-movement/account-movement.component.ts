import { Component, OnInit } from '@angular/core';
import {AccountMovementService} from '../service/account-movement.service';
import {AccountMovement} from './model';

@Component({
  selector: 'app-account-movement',
  templateUrl: './account-movement.component.html',
  styleUrls: ['./account-movement.component.scss']
})
export class AccountMovementComponent implements OnInit {

  accountMovements: AccountMovement[] = [];

  constructor(private movement: AccountMovementService) { }

  ngOnInit() {
    this.movement.getAccountMovementsForUser().subscribe(arr => this.accountMovements = arr);
  }
}
