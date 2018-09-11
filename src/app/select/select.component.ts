import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-select',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.css']
})
export class SelectComponent implements OnInit {
    @Input('options') options:string[][];
    @Input('model') model:string;
    @Output('selected') selected = new EventEmitter<string>();
    @Input('filter') filter:any[];

    constructor() { }

    ngOnInit() {
    }
}
