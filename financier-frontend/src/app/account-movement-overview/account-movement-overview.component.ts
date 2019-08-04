import { Component, OnInit } from '@angular/core';
import {AccountMovementService} from '../service/account-movement.service';
import {AccountMovement} from './model';

@Component({
  selector: 'app-account-movement-overview',
  templateUrl: './account-movement-overview.component.html',
  styleUrls: ['./account-movement-overview.component.scss']
})
export class AccountMovementOverviewComponent implements OnInit {

  accountMovements: AccountMovement[] = [];

  constructor(private movement: AccountMovementService) { }

  ngOnInit() {
    this.movement.getAccountMovementsForUser().subscribe(arr => this.accountMovements = arr);
  }
}
