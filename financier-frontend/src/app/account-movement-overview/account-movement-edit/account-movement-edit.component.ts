import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountMovement, MovementDirection} from '../model';
import * as moment from 'moment';
import {typeIsOrHasBaseType} from 'tslint/lib/language/typeUtils';

@Component({
  selector: 'app-account-movement-edit',
  templateUrl: './account-movement-edit.component.html',
  styleUrls: ['./account-movement-edit.component.scss']
})
export class AccountMovementEditComponent implements OnInit, OnChanges {

  @Input() mode: ComponentMode;
  @Input() editSource: AccountMovement;
  @Output() close = new EventEmitter();
  @Output() create = new EventEmitter<AccountMovement>();
  @Output() edit = new EventEmitter<AccountMovement>();
  beforeEdit: { [k: string]: string };
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

  // readonly dateFormat = 'YYYY-MM-DDThh:mmZZ';
  readonly dateFormat = 'YYYY-MM-DD';

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.mode) {
      this.setFormVisibility();
      this.setFormValue();
    }
  }

  ngOnInit() {
    this.setFormVisibility();
    this.setFormValue();
  }

  setFormVisibility() {
    if (this.mode === ComponentMode.DELETE) {
      this.accountMovement.disable();
    } else {
      this.accountMovement.enable();
    }
  }

  setFormValue() {
    if (this.mode === ComponentMode.EDIT || this.mode === ComponentMode.DELETE) {
      const date = moment(this.editSource.valuata, this.dateFormat).toDate();
      this.beforeEdit = {
        value: this.editSource.value,
        date: date.toISOString(),
        description: this.editSource.description
      };
      this.accountMovement.patchValue(this.beforeEdit);
    }
  }

  closeComponent() {
    this.close.emit();
  }

  saveAccountMovement() {
    this.create.emit(this.mapToAccountMovement());
  }

  editAccountMovement() {
    console.log('d');
    this.edit.emit(this.mapToAccountMovement(this.editSource.id));
  }

  private mapToAccountMovement(entityId: number = null): AccountMovement {
    const amount = this.accountMovement.get('value').value;
    const d: Date = this.accountMovement.get('date').value;
    return {
      id: entityId,
      value: amount,
      valuata: moment(d).format(this.dateFormat),
      description: this.accountMovement.get('description').value,
      movementDirection: amount > 0 ? MovementDirection.DEBIT : MovementDirection.CREDIT
    };
  }

  hasContentChange() {
    const current = this.mapToAccountMovement();

    return current.valuata !== this.editSource.valuata
      || current.description !== this.editSource.description
      || current.value !== this.editSource.value;
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

  isDeleteMode() {
    return this.mode === ComponentMode.DELETE;
  }

  deleteAccountMovement() {

  }
}

export enum ComponentMode {
  CREATE, EDIT, DELETE
}
