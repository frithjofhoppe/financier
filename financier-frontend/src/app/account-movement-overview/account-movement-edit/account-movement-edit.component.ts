import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-account-movement-edit',
  templateUrl: './account-movement-edit.component.html',
  styleUrls: ['./account-movement-edit.component.scss']
})
export class AccountMovementEditComponent implements OnInit {

  accountMovement: FormGroup = new FormGroup({
    value: new FormControl(''),
    date: new FormControl(''),
    description: new FormControl('')
  });

  constructor() {
  }

  ngOnInit() {
  }

}
