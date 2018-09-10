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

    DatasetOptions = [
        ['mn_data.json', 'Multivariable Normal Data'],
        ['census.snappy_data.json', 'Synthetic Census Data'],
    ]
    dataset = this.DatasetOptions[0][0];

    RebinTypeOptions = [['none', 'None'], ['square', 'Square'], ['rect', 'Rect'], ['voronoi', 'Voronoi'], ['topojson']];
    rebinType = 'square';
    rebinSize = 4;
    rebinHeight = 4;
    rebinWidth = 4;

    RebinAggregationOptions = ['max', 'mean', 'sum', 'min'];
    rebinAggregation = 'max';

    ComposeMixOptions = [
        ['none',],
        ['invmin',],
        ['mean',],
        ['max',],
        ['blend',],
        ['weavingrandom',],
        ['weavingsquare',],
        ['weavinghex',],
        ['weavingtri',],
        ['propline',],
        ['hatching',],
        ['separate',],
        ['glyph',],
        ['dotdensity',],
        ['time',],
    ];
    composeMix = 'mean';

    ComposeMixingOptions = [
        ['additive'],
        ['multiplicative', ]
    ];
    composeMixing = 'additive';

    RescaleTypeOptions = [
        ['linear', 'Linear'],
        ['log', 'Log'],
        ['sqrt', 'Square Root'],
        ['cbrt', 'Cubic Root'],
        ['equidepth', 'Equi-depth']];
    rescaleType = 'linear';
    rescaleLevels = 4;

    spec;

    print = console.log;

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

        this.change();
    }

    change() {
        let spec = {};

        console.log(this.rebinType, this.rebinSize);
        spec = {
            "description": "multivariate normal data",
            "data": {
                "url": this.dataset
            },
            "compose": {
                "mix": this.composeMix,
                "mixing": this.composeMixing
            },
            "rebin": {
                "type": this.rebinType,
                "size": this.rebinSize,
                "width": this.rebinWidth,
                "height": this.rebinHeight,
                "aggregation": this.rebinAggregation
            },
            "rescale": {
                "type": this.rescaleType,
                "levels": this.rescaleLevels
            }
        }

        this.spec = JSON.stringify(spec, null, 2);
        this.result.nativeElement.querySelectorAll('*').forEach(d => d.remove());

        console.log(spec);
        let config = new MDM.Configuration(spec);
        config.load('/assets/').then(() => {
            let interp = new MDM.Interpreter(config);

            console.log(interp)
            interp.interpret();
            interp.render(this.result.nativeElement);
        })
    }
}
