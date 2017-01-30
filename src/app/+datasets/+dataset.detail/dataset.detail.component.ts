import {
  Component,
  OnInit,
} from '@angular/core';

@Component({
  selector: 'dataset-detail',
  template: `
    <h1>Hello from Dataset Detail</h1>
  `,
})

export class DatasetDetailComponent implements OnInit {

  public ngOnInit() {
    console.log('hello `DatasetDetail` component');
  }

}
