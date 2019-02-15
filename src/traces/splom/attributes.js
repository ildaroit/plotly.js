/**
* Copyright 2012-2019, Plotly, Inc.
* All rights reserved.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/

'use strict';

var scatterAttrs = require('../scatter/attributes');
var colorAttrs = require('../../components/colorscale/attributes');
var hovertemplateAttrs = require('../../components/fx/hovertemplate_attributes');
var scatterGlAttrs = require('../scattergl/attributes');
var cartesianIdRegex = require('../../plots/cartesian/constants').idRegex;
var templatedArray = require('../../plot_api/plot_template').templatedArray;
var extendFlat = require('../../lib/extend').extendFlat;

var scatterMarkerAttrs = scatterAttrs.marker;
var scatterMarkerLineAttrs = scatterMarkerAttrs.line;

var markerLineAttrs = extendFlat(colorAttrs('marker.line', {editTypeOverride: 'calc'}), {
    width: extendFlat({}, scatterMarkerLineAttrs.width, {editType: 'calc'}),
    editType: 'calc'
});

var markerAttrs = extendFlat(colorAttrs('marker'), {
    symbol: scatterMarkerAttrs.symbol,
    size: extendFlat({}, scatterMarkerAttrs.size, {editType: 'markerSize'}),
    sizeref: scatterMarkerAttrs.sizeref,
    sizemin: scatterMarkerAttrs.sizemin,
    sizemode: scatterMarkerAttrs.sizemode,
    opacity: scatterMarkerAttrs.opacity,
    colorbar: scatterMarkerAttrs.colorbar,
    line: markerLineAttrs,
    editType: 'calc'
});

markerAttrs.color.editType = markerAttrs.cmin.editType = markerAttrs.cmax.editType = 'style';

function makeAxesValObject(axLetter) {
    return {
        valType: 'info_array',
        freeLength: true,
        role: 'info',
        editType: 'calc',
        items: {
            valType: 'subplotid',
            regex: cartesianIdRegex[axLetter],
            editType: 'plot'
        },
        description: [
            'Sets the list of ' + axLetter + ' axes',
            'corresponding to dimensions of this splom trace.',
            'By default, a splom will match the first N ' + axLetter + 'axes',
            'where N is the number of input dimensions.',
            'Note that, in case where `diagonal.visible` is false and `showupperhalf`',
            'or `showlowerhalf` is false, this splom trace will generate',
            'one less x-axis and one less y-axis.',
        ].join(' ')
    };
}

module.exports = {
    dimensions: templatedArray('dimension', {
        visible: {
            valType: 'boolean',
            role: 'info',
            dflt: true,
            editType: 'calc',
            description: [
                'Determines whether or not this dimension is shown on the graph.',
                'Note that even visible false dimension contribute to the',
                'default grid generate by this splom trace.'
            ].join(' ')
        },
        label: {
            valType: 'string',
            role: 'info',
            editType: 'calc',
            description: 'Sets the label corresponding to this splom dimension.'
        },
        values: {
            valType: 'data_array',
            role: 'info',
            editType: 'calc+clearAxisTypes',
            description: 'Sets the dimension values to be plotted.'
        },

        axis: {
            type: {
                valType: 'enumerated',
                values: ['linear', 'log', 'date', 'category'],
                role: 'info',
                editType: 'calc+clearAxisTypes',
                description: [
                    'Sets the axis type for this dimension\'s generated',
                    'x and y axes.',
                    'Note that the axis `type` values set in layout take',
                    'precedence over this attribute.'
                ].join(' ')
            },

            editType: 'calc+clearAxisTypes'
        },

        // TODO should add an attribute to pin down x only vars and y only vars
        // like https://seaborn.pydata.org/generated/seaborn.pairplot.html
        // x_vars and y_vars

        // maybe more axis defaulting option e.g. `showgrid: false`

        editType: 'calc+clearAxisTypes'
    }),

    // mode: {}, (only 'markers' for now)

    text: extendFlat({}, scatterGlAttrs.text, {
        description: [
            'Sets text elements associated with each (x,y) pair to appear on hover.',
            'If a single string, the same string appears over',
            'all the data points.',
            'If an array of string, the items are mapped in order to the',
            'this trace\'s (x,y) coordinates.'
        ].join(' ')
    }),
    hovertemplate: hovertemplateAttrs(),

    marker: markerAttrs,

    xaxes: makeAxesValObject('x'),
    yaxes: makeAxesValObject('y'),

    diagonal: {
        visible: {
            valType: 'boolean',
            role: 'info',
            dflt: true,
            editType: 'calc',
            description: [
                'Determines whether or not subplots on the diagonal are displayed.'
            ].join(' ')
        },

        // type: 'scattergl' | 'histogram' | 'box' | 'violin'
        // ...
        // more options

        editType: 'calc'
    },

    showupperhalf: {
        valType: 'boolean',
        role: 'info',
        dflt: true,
        editType: 'calc',
        description: [
            'Determines whether or not subplots on the upper half',
            'from the diagonal are displayed.'
        ].join(' ')
    },
    showlowerhalf: {
        valType: 'boolean',
        role: 'info',
        dflt: true,
        editType: 'calc',
        description: [
            'Determines whether or not subplots on the lower half',
            'from the diagonal are displayed.'
        ].join(' ')
    },

    selected: {
        marker: scatterGlAttrs.selected.marker,
        editType: 'calc'
    },
    unselected: {
        marker: scatterGlAttrs.unselected.marker,
        editType: 'calc'
    },

    opacity: scatterGlAttrs.opacity
};
