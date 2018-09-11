import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import * as MDM from 'multiclass-density-maps';
import { isNumber } from 'util';

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

    readonly defaultDataset = this.DatasetOptions[0][0];
    dataset = this.defaultDataset;

    RebinTypeOptions = [['none', 'None'], ['square', 'Square'], ['rect', 'Rect'], ['voronoi', 'Voronoi'], ['topojson']];

    readonly defaultRebinType = 'none';
    rebinType = this.defaultRebinType;

    readonly defaultRebinSize = 4;
    rebinSize = this.defaultRebinSize;

    readonly defaultRebinHeight = 4;
    rebinHeight = this.defaultRebinHeight;

    readonly defaultRebinWidth = 4;
    rebinWidth = this.defaultRebinWidth;

    readonly defaultRebinNumCenters = 10;
    rebinNumCenters = this.defaultRebinNumCenters;

    RebinAggregationOptions = ['max', 'mean', 'sum', 'min'];
    readonly defaultRebinAggregation = this.RebinAggregationOptions[0];
    rebinAggregation = this.defaultRebinAggregation;

    RebinUrlOptions = ['us.json'];
    readonly defaultRebinUrl = this.RebinUrlOptions[0];
    rebinUrl = this.defaultRebinUrl;

    RebinFeatureOptions = ['states', 'counties'];
    readonly defaultRebinFeature = this.RebinFeatureOptions[0];
    rebinFeature = this.defaultRebinFeature;

    readonly defaultRebinStroke = 'rgba(0, 0, 0, .1)';
    rebinStroke = this.defaultRebinStroke;

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
    readonly defaultComposeMix = this.ComposeMixOptions[0][0];
    composeMix = this.defaultComposeMix;

    ComposeMixingOptions = [
        ['additive', 'Additive'],
        ['multiplicative', 'Multiplicative']
    ];
    readonly defaultComposeMixing = this.ComposeMixingOptions[0][0];
    composeMixing = this.defaultComposeMixing;

    ComposeShapeOptions = [
        ['square', 'Square'],
        ['random', 'Random'],
        ['hex', 'Hexagon'],
        ['tri', 'Triangle']
    ];
    readonly defaultComposeShape = this.ComposeShapeOptions[0][0];
    composeShape = this.defaultComposeShape;

    readonly defaultComposeInterval = .6;
    composeInterval = this.defaultComposeInterval;

    readonly defaultComposeSize = 8;
    composeSize = this.defaultComposeSize;

    readonly defaultComposeSort = true;
    composeSort = this.defaultComposeSort;

    readonly defaultComposeColprop = true;
    composeColprop = this.defaultComposeColprop;

    ComposeWidthpropOptions = [
        ['none', 'None'],
        ['percent', 'Percent'],
        ['constant', 'Constant']
    ];

    readonly defaultComposeWidthprop = 'percent';
    composeWidthprop = this.defaultComposeWidthprop;

    readonly defaultComposeWidthpropConstant = 4;
    composeWidthpropConstant = this.defaultComposeWidthpropConstant;

    readonly defaultComposeThreshold = 1;
    composeThreshold = this.defaultComposeThreshold;

    ComposeGlyphSpecOptions = [
        'bars', 'punchcard'
    ];

    readonly defaultComposeGlyphSpec = 'punchcard';
    composeGlyphSpec = this.defaultComposeGlyphSpec;

    readonly defaultComposeGlyphSpecWidth = 32;
    composeGlyphSpecWidth = this.defaultComposeGlyphSpecWidth;

    readonly defaultComposeGlyphSpecHeight = 32;
    composeGlyphSpecHeight = this.defaultComposeGlyphSpecHeight;

    RescaleTypeOptions = [
        ['linear', 'Linear'],
        ['log', 'Log'],
        ['sqrt', 'Square Root'],
        ['cbrt', 'Cubic Root'],
        ['equidepth', 'Equi-depth']];
    readonly defaultRescaleType = this.RescaleTypeOptions[0][0];
    rescaleType = 'linear';

    readonly defaultRescaleLevels = 4;
    rescaleLevels = this.defaultRescaleLevels;

    readonly defaultUseAxis = false;
    useAxis = this.defaultUseAxis;

    readonly defaultUseLegend = true;
    useLegend = this.defaultUseLegend;

    spec: any;
    print = console.log;

    constructor(private route: ActivatedRoute) {

    }

    ngOnInit() {
        this.route.queryParams.subscribe(queryParams => {
            if (queryParams.spec) {
                this.importSpec(JSON.parse(atob(queryParams.spec)));
                this.change();
            }
        });

        this.change();
    }

    importSpec(spec: any) {
        this.dataset = spec.data.url;

        this.composeMix = spec.compose ? spec.compose.mix : this.defaultComposeMix;
        if (this.composeMix == 'blend') this.composeMixing = spec.compose.mixing || this.defaultComposeMixing;
        else if (this.composeMix === 'weaving') {
            this.composeShape = spec.compose.shape || this.defaultComposeShape;
            this.composeSize = spec.compose.size || this.defaultComposeSize;
        }
        else if (this.composeMix == 'time') this.composeInterval = spec.compose.interval || this.defaultComposeInterval;
        else if (this.composeMix == 'propline' || this.composeMix == 'hatching') {
            this.composeSort = spec.compose.sort || this.defaultComposeSort
            this.composeColprop = spec.compose.colprop || this.defaultComposeColprop;

            if (spec.compose.widthprop == 'percent') {
                this.composeWidthprop = 'percent';
                this.composeWidthpropConstant = this.defaultComposeWidthpropConstant;
            }
            else if (isNumber(spec.compose.widthprop)) {
                this.composeWidthprop = 'constant';
                this.composeWidthpropConstant = spec.compose.widthprop;
            }
            else {
                this.composeWidthprop = this.defaultComposeWidthprop;
                this.composeWidthpropConstant = this.defaultComposeWidthpropConstant;
            }
        }
        else if (this.composeMix == 'invmin')
            this.composeThreshold = spec.compose.threshold || this.defaultComposeThreshold;
        else if (this.composeMix == 'dotdensity')
            this.composeSize = spec.compose.size || this.defaultComposeSize
        else if (this.composeMix == 'glyph') {
            this.composeGlyphSpec = spec.compose.glyphSpec.template;
            this.composeGlyphSpecWidth = spec.compose.glyphSpec.width || this.defaultComposeGlyphSpecWidth;
            this.composeGlyphSpecHeight = spec.compose.glyphSpec.height || this.defaultComposeGlyphSpecHeight;
        }

        if (spec.rebin) {
            this.rebinType = spec.rebin.type || this.defaultRebinType;
            this.rebinAggregation = spec.rebin.aggregation || this.defaultRebinAggregation;

            if (this.rebinType == 'square') this.rebinSize = spec.rebin.size || this.defaultRebinSize;
            else if (this.rebinType == 'rect') {
                this.rebinWidth = spec.rebin.width || this.defaultRebinWidth;
                this.rebinHeight = spec.rebin.height || this.defaultRebinHeight;
            }
            else if (this.rebinType == 'voronoi') {
                this.rebinNumCenters = spec.rebin.size || this.defaultRebinNumCenters;
                this.rebinStroke = spec.rebin.stroke || this.defaultRebinStroke;
            }
            else if (this.rebinType == 'topojson') {
                this.rebinUrl = spec.rebin.url || this.defaultRebinUrl;
                this.rebinFeature = spec.rebin.feature || this.defaultRebinFeature
                this.rebinStroke = spec.rebin.stroke || this.defaultRebinStroke;
            }
        }

        this.rescaleType = (spec.rescale && spec.rescale.type) ? spec.rescale.type : this.defaultRescaleType;
        if (this.rescaleType == 'equidepth') this.rescaleLevels = spec.rescale.levels || this.defaultRescaleLevels;

        this.useLegend = spec.legend;
        this.useAxis = spec.axis;
    }

    exportSpec() {
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
                spec.compose.glyphSpec = {
                    template: this.composeGlyphSpec,
                    width: this.composeGlyphSpecWidth,
                    height: this.composeGlyphSpecHeight
                };
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

        return spec;
    }


    change() {
        let spec = this.exportSpec();

        this.spec = JSON.stringify(spec, null, 2);

        let config = new MDM.Configuration(spec);
        config.load('/assets/').then(() => {
            let interp = new MDM.Interpreter(config);

            interp.interpret();

            this.result.nativeElement.querySelectorAll('*').forEach(d => d.remove());
            interp.render(this.result.nativeElement);
        })
    }
}
