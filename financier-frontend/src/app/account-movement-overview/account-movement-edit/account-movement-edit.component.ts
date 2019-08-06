import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountMovement, MovementDirection} from '../model';
import * as moment from 'moment';

@Component({
  selector: 'app-account-movement-edit',
  templateUrl: './account-movement-edit.component.html',
  styleUrls: ['./account-movement-edit.component.scss']
})
export class AccountMovementEditComponent implements OnInit {

  @Input() mode: ComponentMode;
  @Input() editSource: AccountMovement;
  @Output() close = new EventEmitter();
  @Output() save = new EventEmitter<AccountMovementOutput>();
  beforeEdit: {};
  accountMovement: FormGroup = new FormGroup({
    value: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d+)?$/)
    ]),
    date: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl('')
  });

  constructor() {
  }

  ngOnInit() {
    if (this.mode === ComponentMode.EDIT) {

      const d = moment(this.editSource.valuata, 'YYYY-MM-DDThh:mmZZ').toDate();
      this.beforeEdit = {
        value: this.editSource.value,
        date: d.toISOString(),
        description: this.editSource.description
      };
      this.accountMovement.patchValue(this.beforeEdit);
    }
  }

  closeComponent() {
    this.close.emit();
  }

  saveAccountMovement() {
    this.save.emit({
      action: ComponentMode.CREATE,
      dto: this.mapToAccountMovement()
    });
  }

  editAccountMovement() {
    console.log('d');
    this.save.emit({
      action: ComponentMode.EDIT,
      dto: this.mapToAccountMovement(this.editSource.id)
    });
  }

  private mapToAccountMovement(entityId: number = null): AccountMovement {
    const amount = this.accountMovement.get('value').value;
    const d: Date = this.accountMovement.get('date').value;
    return {
      id: entityId,
      value: amount,
      valuata: moment(d).format('YYYY-MM-DDThh:mmZZ'),
      description: this.accountMovement.get('description').value,
      movementDirection: amount > 0 ? MovementDirection.DEBIT : MovementDirection.CREDIT
    };
  }

  isCreateMode() {
    return this.mode === ComponentMode.CREATE;
  }

  isEditMode() {
    return this.mode === ComponentMode.EDIT;
  }

  editCancel() {
    this.accountMovement.patchValue(this.beforeEdit);
    this.accountMovement.markAsUntouched();
  }
}

export enum ComponentMode {
  CREATE, EDIT
}

export interface AccountMovementOutput {
  action: ComponentMode;
  dto: AccountMovement;
}
