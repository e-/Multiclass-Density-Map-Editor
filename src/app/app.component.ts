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
    rebinNumCenters = 10;

    RebinAggregationOptions = ['max', 'mean', 'sum', 'min'];
    rebinAggregation = 'max';

    RebinUrlOptions = ['us.json'];
    rebinUrl = 'us.json';

    RebinFeatureOptions = ['states', 'counties'];
    rebinFeature = 'states';

    rebinStroke = 'rgba(0, 0, 0, .1)';

    ComposeMixOptions = [
        ['none', 'None'],
        ['invmin', 'Invmin'],
        ['mean', 'Mean'],
        ['max', 'Max'],
        ['blend', 'Blend'],
        ['weaving', 'Weaving'],
        ['propline', 'Propline'],
        ['hatching', 'Hatching'],
        ['separate', 'Separate'],
        ['glyph', 'Glyph'],
        ['dotdensity', 'Dotdensity'],
        ['time', 'Time'],
    ];
    composeMix = 'none';

    ComposeMixingOptions = [
        ['additive', 'Additive'],
        ['multiplicative', 'Multiplicative']
    ];
    composeMixing = 'additive';

    ComposeShapeOptions = [
        ['square', 'Square'],
        ['random', 'Random'],
        ['hex', 'Hexagon'],
        ['tri', 'Triangle']
    ];
    composeShape = 'square';

    composeInterval = 0.6;
    composeSize = 8;

    composeSort = true;
    composeColprop = true;
    ComposeWidthpropOptions = [
        ['none', 'None'],
        ['percent', 'Percent'],
        ['constant', 'Constant']
    ];

    composeWidthprop = 'percent';
    composeWidthpropConstant = 4;

    composeThreshold = 1;

    ComposeGlyphSpecOptions = [
        'bars', 'punchcard'
    ];
    composeGlyphSpec = 'punchcard';

    RescaleTypeOptions = [
        ['linear', 'Linear'],
        ['log', 'Log'],
        ['sqrt', 'Square Root'],
        ['cbrt', 'Cubic Root'],
        ['equidepth', 'Equi-depth']];
    rescaleType = 'linear';
    rescaleLevels = 4;

    spec: any;
    useAxis = false;
    useLegend = true;

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
        let spec: any = { "data": { "url": this.dataset } };

        if (this.composeMix != 'none') {
            spec.compose = {};
            spec.compose.mix = this.composeMix;
            if (this.composeMix == 'blend') spec.compose.mixing = this.composeMixing;
            else if (this.composeMix === 'weaving') {
                spec.compose.shape = this.composeShape;
                spec.compose.size = this.composeSize;
            }
            else if (this.composeMix == 'time') spec.compose.interval = this.composeInterval;
            else if (this.composeMix == 'propline' || this.composeMix == 'hatching') {
                spec.compose.sort = this.composeSort;
                spec.compose.colprop = this.composeColprop;
                if (this.composeWidthprop == 'percent') spec.compose.widthprop = 'percent';
                else if (this.composeWidthprop == 'constant') spec.compose.widthprop = this.composeWidthpropConstant;
            }
            else if (this.composeMix == 'invmin')
                spec.compose.threshold = this.composeThreshold;
            else if (this.composeMix == 'dotdensity')
                spec.compose.size = this.composeSize;
            else if (this.composeMix == 'glyph')
                spec.compose.glyphSpec = { template: this.composeGlyphSpec };
        }

        if (this.rebinType != 'none') {
            spec.rebin = {};
            spec.rebin.type = this.rebinType;
            spec.rebin.aggregation = this.rebinAggregation;

            if (this.rebinType == 'square') spec.rebin.size = this.rebinSize;
            else if (this.rebinType == 'rect') { spec.rebin.width = this.rebinWidth; spec.rebin.height = this.rebinHeight; }
            else if (this.rebinType == 'voronoi') {
                spec.rebin.size = this.rebinNumCenters;
                if (this.rebinStroke) spec.rebin.stroke = this.rebinStroke;
            }
            else if (this.rebinType == 'topojson') {
                spec.rebin.url = this.rebinUrl;
                spec.rebin.feature = this.rebinFeature;
                if (this.rebinStroke) spec.rebin.stroke = this.rebinStroke;
            }
        }

        spec.rescale = { type: this.rescaleType };
        if (this.rescaleType == 'equidepth') spec.rescale.levels = this.rescaleLevels;

        spec.legend = this.useLegend;
        spec.axis = this.useAxis;

        this.spec = JSON.stringify(spec, null, 2);
        this.result.nativeElement.querySelectorAll('*').forEach(d => d.remove());

        let config = new MDM.Configuration(spec);
        config.load('/assets/').then(() => {
            let interp = new MDM.Interpreter(config);

            interp.interpret();
            interp.render(this.result.nativeElement);
        })
    }
}
