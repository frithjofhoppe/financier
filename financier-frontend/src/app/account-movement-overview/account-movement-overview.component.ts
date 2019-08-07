import {Component, OnInit} from '@angular/core';
import {AccountMovementService} from '../service/account-movement.service';
import {AccountMovement} from './model';
import {mergeMap, tap} from 'rxjs/operators';
import {ComponentMode} from './account-movement-edit/account-movement-edit.component';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';

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
  DELETE = ComponentMode.DELETE;
  currentMode: ComponentMode = ComponentMode.EDIT;

  constructor(private movement: AccountMovementService, private matSnackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.loadAccountMovements().subscribe();
  }

  isInDeleteMode() {
    return this.currentMode === this.DELETE;
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

  openSnackBar(message: string, action: string) {
    this.matSnackBar.open(message, action, {
      duration: 2000,
    });
  }

  createAccountMovement($event: AccountMovement) {
    this.updateSourceList(this.movement.saveAccountMovement($event).pipe(
      tap(() => this.openSnackBar('Movement has been created', 'Create'))
    )).subscribe();
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

  editAccountMovement($event: AccountMovement) {
    this.updateSourceList(this.movement.updateAccountMovement($event).pipe(
      tap(() => this.openSnackBar('Movement has been modified', 'Update'))
    )).subscribe();
  }

  enterDeleteMode() {
    this.currentMode = ComponentMode.DELETE;
  }

  leaveDeleteMode() {
    this.currentMode = ComponentMode.EDIT;
  }
}
