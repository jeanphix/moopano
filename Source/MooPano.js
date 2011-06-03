/*
    
*/

var MooPano = new Class({

    Implements: [Options],
    
    options: {
        points: {},
        big: null
    },

    initialize: function(element, options) {
        this.setOptions(options);
        this.position = {
            x: null,
            y: null
        }
        this.small = document.id(element);
        if(!this.small.complete) {
            this.small.addEvent('load', function() {
                this.initSmall();
            }.bind(this));
        } else {
            this.initSmall();
        }
    },

    initSmall: function(){
        this.top = this.small.getPosition().y;
        this.left = this.small.getPosition().x;
        this.big = new Element('img', {
           src: this.options.big,
           styles: {
                position: 'absolute',
                opacity: 0,
                cursor: 'crosshair',
                padding: '0',
                margin: '0'
            } 
        });
        this.loader = new Element('p', {
           'class': 'loader',
           styles: {
                position: 'absolute',
                top: '-1em',
                left: 0,
                opacity: 0.8,
                background: '#000',
                color: '#fff',
                padding: '0.2em 1em'
            },
            text: 'loading...'
        });
        this.wrapper = new Element('div',{
            'class': 'big',
            styles: {
                position: 'absolute',
                top: this.top,
                left: this.left,
                width: this.small.offsetWidth, 
                height: this.small.offsetHeight,
                overflow: 'hidden',
                zIndex: (this.small.getStyle('zIndex').toInt() || 0) + 1 
            },
            events: {
                mouseenter: this.startZoom.bind(this),
                mouseleave: this.stopZoom.bind(this),
                mousemove: this.move.bind(this)
            }
        }).adopt(this.loader).inject(document.body);
        if(!this.big.complete) {
            this.big.addEvent('load', function() {
                this.initBig();
            }.bind(this));
        } else {
            this.initBig();
        }        
    },

    initBig: function(){
        this.wrapper.adopt(this.big);
        this.loader.destroy();
    },

    displayPoint: function(key) {
        this.options.points[key].display(this);
    },

    hidePoint: function(key) {
        this.options.points[key].hide(this);
    },

    move: function(event){
        this.position = this.getCoord({
            x: event.page.x - this.left,
            y: event.page.y - this.top
        });
    },

    startZoom: function(){
        this.position = this.getCoord({
            x: 0,
            y: 0
        });
        this.zoom();
        this.timer = this.zoom.periodical(10, this);
        this.big.fade('in');
    },
    
    zoom: function(){
        if(!this.position) return;
        this.big.setStyles(this.position);
    },

    zoomToCenter: function(coord){
        this.zoomed = true;
        this.position = this.getCenterCoord(coord);
        this.big.setStyles(this.position);
        this.big.fade('in');
    },

    stopZoom: function(){
        this.timer = null;
        this.zoomed = false;
        this.big.fade('out');
    },

    getCenterCoord: function(coord){
        return {
            top: - parseInt((coord.y * this.big.height / this.small.height) - this.small.height /2 ),
            left: - parseInt((coord.x * this.big.width / this.small.width) - this.small.width /2) 
        }
    },

    getCoord: function(coord){
        return {
            top: - parseInt(coord.y * (this.big.height - this.small.height) / this.small.height),
            left: - parseInt(coord.x * (this.big.width - this.small.width) / this.small.width) 
        }
    }
});