import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit, OnChanges {

  @Input() text: string;
  @Input() source: Observable<any>;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
  }


  ngOnInit() {
  }
}
