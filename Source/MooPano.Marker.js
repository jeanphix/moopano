/*
---
description: MooPano.Marker class.

license: MIT-style

authors:
- Jean-Philippe Serafin <serafinjp@gmail.com>

requires: 
  core/1.3.2: '*'

provides: [MooPano.Marker]

...
*/
MooPano.Marker = new Class({

    Implements: [Options],

    options: {
        top: null,
        left: null,
        title: ''
    },

    initialize: function(options) {
        this.zoomed = false;
        this.setOptions(options);
        this.marker = new Element('div', {
            'class': 'marker',
            styles: {
                position: 'absolute',
                overflow: 'hidden',
                display: 'none'
            }
        }).adopt(new Element('p').set('html', this.options.title));
        this.marker.inject(document.body);
    },

    display: function(map) {
        if(!map.zoomed){
            this.marker.setStyles({
                top: map.top + this.options.top,
                left: map.left + this.options.left, 
                display: 'block',
                zIndex: (map.small.getStyle('zIndex').toInt() || 0) + 2
            });
        }else{
            var coord = map.getCenterCoord({
                x: this.options.left,
                y: this.options.top
            }); 
            this.marker.setStyles({
                top: map.top + map.position.top - coord.top +  (map.small.height / 2),
                left: map.left + map.position.left - coord.left +  (map.small.width / 2), 
                display: 'block',
                zIndex: (map.small.getStyle('zIndex').toInt() || 0) + 2
            });
        }
    },

    hide: function(map) {
        this.marker.setStyles({
            display: 'none'
        });
    }
});