import {Component, OnInit} from '@angular/core';
import {AccountMovementService} from '../service/account-movement.service';
import {AccountMovement, Tag} from './model';
import {mergeMap, tap} from 'rxjs/operators';
import {ComponentMode} from './account-movement-edit/account-movement-edit.component';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';
import {TagService} from '../service/tag.service';

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
  tags: Tag[] = [];

  constructor(private movement: AccountMovementService, private matSnackBar: MatSnackBar, private tagService: TagService) {
  }

  ngOnInit() {
    this.loadAccountMovementsAndTags().subscribe();
    // this.tagService.getTags().subscribe(tags => this.tags = tags);
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

  private loadAccountMovementsAndTags() {
    this.isProgressBarVisible = true;
    return this.movement.getAccountMovementsForUser().pipe(
      tap(movements => this.accountMovements = movements),
      mergeMap(() => this.tagService.getTags().pipe(
        tap(tags => this.tags = tags)
      )),
      tap(() => this.isProgressBarVisible = false)
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

  updateSourceList(ob: Observable<void>): Observable<any> {
    return ob.pipe(
      mergeMap(() => {
        this.hideEditField();
        return this.loadAccountMovementsAndTags();
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

  deleteAccountMovement($event: number) {
    this.updateSourceList(this.movement.deleteAccountMovement($event).pipe(
      tap(() => this.openSnackBar('Movement has been deleted', 'Delete'))
    )).subscribe();
  }
}
