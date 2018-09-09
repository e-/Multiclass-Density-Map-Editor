import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as MDM from 'multiclass-density-maps';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'Multiclass-Density-Map-Editor';
    @ViewChild('result') result: ElementRef;
    dataType: number = 1;
    rebin = 4;

    ngOnInit() {
        // let spec = {
        //     "description": "multivariate normal data",
        //     "data": {
        //         "url": "mn_data.json"
        //     },
        //     "compose": {
        //         "mix": "max",
        //         "mixing": "additive"
        //     }
        // };


        this.render();
    }

    render() {
        let spec = {
            "description": "multivariate normal data",
            "data": {
                "url": "mn_data.json"
            },
            "compose": {
                "mix": "max",
                "mixing": "additive"
            },
            "rebin": {
                "type": "square",
                "size": this.rebin
            },
            "rescale": {
                "type": "equidepth",
                "levels": 3
            }
        }

        this.result.nativeElement.querySelectorAll('*').forEach(d => d.remove());

        let config = new MDM.Parser.Configuration(spec);
        config.load('/assets/').then(() => {
            let interp = new MDM.Interpreter(config);

            interp.interpret();
            interp.render(this.result.nativeElement);
        })
    }
}
