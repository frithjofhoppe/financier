import {Component, OnInit} from '@angular/core';
import {AccountMovementService} from '../service/account-movement.service';
import {AccountMovement} from './model';
import {mergeMap, tap} from 'rxjs/operators';
import {AccountMovementOutput, ComponentMode} from './account-movement-edit/account-movement-edit.component';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-account-movement-overview',
  templateUrl: './account-movement-overview.component.html',
  styleUrls: ['./account-movement-overview.component.scss']
})
export class AccountMovementOverviewComponent implements OnInit {

  accountMovements: AccountMovement[] = [];
  isEditFieldVisible = false;
  isProgressBarVisible = false;
  CREATE = ComponentMode.CREATE;
  EDIT = ComponentMode.EDIT;

  constructor(private movement: AccountMovementService) {
  }

  ngOnInit() {
    this.loadAccountMovements().subscribe();
  }

  showEditField() {
    this.isEditFieldVisible = true;
  }

  hideEditField() {
    this.isEditFieldVisible = false;
  }

  private loadAccountMovements() {
    return this.movement.getAccountMovementsForUser().pipe(
      tap(movements => this.accountMovements = movements)
    );
  }

  saveAccountMovement($event: AccountMovementOutput) {
    this.isProgressBarVisible = true;
    console.log('in');
    if ($event.action === ComponentMode.CREATE) {
      console.log('CREATE');
      this.updateSourceList(this.movement.saveAccountMovement($event.dto)).subscribe();
    } else if ($event.action === ComponentMode.EDIT) {
      console.log('EDIT');
      this.updateSourceList(this.movement.updateAccountMovement($event.dto)).subscribe();
    }
  }

  updateSourceList(ob: Observable<void>): Observable<AccountMovement[]> {
    return ob.pipe(
      mergeMap(() => {
        this.isProgressBarVisible = false;
        this.hideEditField();
        return this.loadAccountMovements();
      })
    );
  }
}
