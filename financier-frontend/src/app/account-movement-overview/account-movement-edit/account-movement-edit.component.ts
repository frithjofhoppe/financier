import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AccountMovement, MovementDirection, Tag} from '../model';
import * as moment from 'moment';
import {typeIsOrHasBaseType} from 'tslint/lib/language/typeUtils';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatChipEvent,
  MatChipInputEvent,
  MatDialog, MatSnackBar
} from '@angular/material';
import {TagService} from '../../service/tag.service';
import {remove} from '@auth0/auth0-spa-js/dist/typings/storage';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {childOfKind} from 'tslint';
import {currentId} from 'async_hooks';

@Component({
  selector: 'app-account-movement-edit',
  templateUrl: './account-movement-edit.component.html',
  styleUrls: ['./account-movement-edit.component.scss']
})
export class AccountMovementEditComponent implements OnInit, OnChanges {

  @Input() mode: ComponentMode;
  @Input() editSource: AccountMovement;
  @Input() tags: Tag[];
  @Output() close = new EventEmitter();
  @Output() create = new EventEmitter<AccountMovement>();
  @Output() delete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<AccountMovement>();
  registeredTags: Tag[] = [];
  selectedTags: Tag[] = [];
  beforeEdit: { [k: string]: any };
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addOnBlur = true;
  selectable = true;
  accountMovement: FormGroup = new FormGroup({
    value: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d+(\.\d+)?$/)
    ]),
    date: new FormControl('', [
      Validators.required
    ]),
    description: new FormControl(''),
    tag: new FormControl('')
  });
  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) auto: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger, {static: false}) autocomplete: MatAutocompleteTrigger;

  readonly dateFormat = 'YYYY-MM-DD';

  constructor(private snackbar: MatSnackBar) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.tags) {
      this.setRegisteredTags(changes.tags.currentValue);
    }
    if (changes.mode) {
      this.setFormVisibility();
      this.setFormValue();
    }
  }

  ngOnInit() {
    this.setRegisteredTags(this.tags);
    this.setFormVisibility();
    this.setFormValue();
    this.setPreFilledTags();
  }

  setRegisteredTags(tags: Tag[]) {
    if (tags) {
      this.registeredTags = tags;
    } else {
      this.registeredTags = [];
    }
  }

  setPreFilledTags() {
    if (this.editSource && this.editSource.tag) {
      this.selectedTags = [this.editSource.tag];
    } else {
      this.selectedTags = [];
    }
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
      this.setPreFilledTags();
      this.beforeEdit = {
        value: this.editSource.value,
        date: date.toISOString(),
        description: this.editSource.description,
        tag: this.editSource.tag
      };
      this.accountMovement.patchValue(this.beforeEdit);
    } else if (this.mode === ComponentMode.CREATE) {
      this.resetForm();
    }
  }

  closeComponent() {
    this.close.emit();
    this.resetForm();
  }

  saveAccountMovement() {
    this.create.emit(this.mapToAccountMovement());
    this.resetForm();
  }

  editAccountMovement() {
    this.edit.emit(this.mapToAccountMovement(this.editSource.id));
  }

  private resetForm() {
    this.accountMovement.reset();
    this.selectedTags = [];
    this.setCurrentDate();
  }

  private setCurrentDate() {
    this.accountMovement.get('date').setValue((new Date()).toISOString());
  }

  private mapToAccountMovement(entityId: number = null): AccountMovement {
    const amount = this.accountMovement.get('value').value;
    const d: Date = this.accountMovement.get('date').value;
    return {
      id: entityId,
      value: amount,
      valuata: moment(d).format(this.dateFormat),
      description: this.accountMovement.get('description').value,
      tag: this.selectedTags.length > 0 ? this.selectedTags[0] : undefined
    };
  }

  hasContentChange() {
    const current = this.mapToAccountMovement();
    let hasTagChanged = true;

    if (!current.tag && !this.editSource.tag) {
      hasTagChanged = false;
    } else if (current.tag && this.editSource.tag && current.tag.identifier === this.editSource.tag.identifier) {
      hasTagChanged = false;
    }

    return current.valuata !== this.editSource.valuata
      || current.description !== this.editSource.description
      || current.value !== this.editSource.value
      || hasTagChanged;
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
    this.delete.emit(this.editSource.id);
  }

  addTagByWriting($event: MatChipInputEvent) {
    if ($event.value && $event.value.trim()) {
      this.autocomplete.closePanel();
      this.pushTag({id: null, identifier: $event.value} as Tag);
    }
    if ($event.input) {
      $event.input.value = '';
    }
  }

  addTagBySelecting($event: MatAutocompleteSelectedEvent) {
    const value = $event.option.value as Tag;
    this.pushTag(value);
    this.tagInput.nativeElement.value = '';
  }

  removeTag(removeTag: Tag) {
    this.selectedTags = this.selectedTags.filter(tag => tag.identifier !== removeTag.identifier);
  }

  private pushTag(tag: Tag) {
    if (this.selectedTags.length < 1) {
      this.pushByCheckingSelected(tag);
    } else {
      this.snackbar.open('Only one label', 'INFO', {
        duration: 2000,
      });
    }
  }

  private pushByCheckingSelected(tag: Tag) {
    const registered = this.registeredTags.find(t => t.identifier.trim().toUpperCase() === tag.identifier.trim().toUpperCase());
    const selected = this.selectedTags.some(t => t.identifier.trim().toUpperCase() === tag.identifier.trim().toUpperCase());
    if (registered && !selected) {
      this.selectedTags.push(registered);
    } else if (!registered && !selected) {
      this.selectedTags.push(tag);
    }
  }
}

export enum ComponentMode {
  CREATE, EDIT, DELETE
}
