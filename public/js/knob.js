$(function($) {

    $(".knob").knob({
        change : function (value) {
        },
        release : function (value) {
            console.log("release : " + value);
        },
        cancel : function () {
            console.log("cancel : ", this);
        },

        draw : function () {
            if(this.$.data('skin') == 'tron') {

                this.cursorExt = 0.3;

                var a = this.arc(this.cv) 
                    , pa     
                    , r = 1;

                this.g.lineWidth = this.lineWidth;

                if (this.o.displayPrevious) {
                    pa = this.arc(this.v);
                    this.g.beginPath();
                    this.g.strokeStyle = this.pColor;
                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
                    this.g.stroke();
                }

                this.g.beginPath();
                this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
                this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
                this.g.stroke();
                this.g.lineWidth = 2;
                this.g.beginPath();
                this.g.strokeStyle = this.o.fgColor;
                this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
                this.g.stroke();

                return false;
            }
        }
    });

    var v, up=0, down=0;

    //object for measuring the rotate value.
    function measure(i, id, min, max, step) {
        this.i = i; 
        this.id = id;
        this.min = min;
        this.max = max;
        this.step = step;
        this.point = "div.ival"+ this.id;
        this.$ival = $(this.point);
        this.in = function() {
            this.i += this.step;
            //if this.i is float number, it will be rounded to second decimal place.
            if(this.i % 1 !== 0){
                this.i = Math.round(this.i*100)/100;
            }
            if(this.i >= this.max) {this.i = this.max;}
        }
        this.de = function() {
            this.i -= this.step;
            if(this.i % 1 !== 0){
                this.i = Math.round(this.i*100)/100;
            }
            if(this.i <= this.min) {this.i = this.min}
        }
    }

    //Initialize the measurements object for the controllers.
    
    //for Grain Set
    window.grainSize = new measure(  10, 1,   0, 1000,    2);
         window.gain = new measure( 0.5, 2,   0,    1, 0.01);
      window.gravity = new measure( 9.8, 3, 0.1, 19.6,  0.1);
  window.restitution = new measure(0.99, 4, 0.5,    1, 0.01);   
     window.variance = new measure(   0, 5,   0,   80,  0.5);

    //for Effect
     window.delaytime = new measure(500, 6,   0, 1000,   10);
     window.delaygain = new measure(0.5, 7,   0,    1, 0.01);

    //Default Values Setting.
    grainSize.$ival.html(grainSize.i);
    gain.$ival.html(gain.i);
    gravity.$ival.html(gravity.i);
    restitution.$ival.html(restitution.i);
    variance.$ival.html(variance.i);
    delaytime.$ival.html(delaytime.i);
    delaygain.$ival.html(delaygain.i);

    //Knobs in Grain Set.
    $("input.grainSize").knob({
        min : 0,
        max : 100000,
        stopper : false,
        change : function () {
            if(v > this.cv){
                if(up){
                    grainSize.de();
                    grainSize.$ival.html(grainSize.i);
                    up=0;
                }else{up=1;down=0;}
            } else {
                if(v < this.cv){
                    if(down){
                        grainSize.in();
                        grainSize.$ival.html(grainSize.i);
                        down=0;
                    }else{down=1;up=0;}
                }
            }
            v = this.cv;
        }
    });   

    $("input.gain").knob({
        min : 0,
        max : 100000,
        stopper : false,
        change : function () {
            if(v > this.cv){
                if(up){
                    gain.de();
                    gain.$ival.html(gain.i);
                    up=0;
                }else{up=1;down=0;}
            } else {
                if(v < this.cv){
                    if(down){                        
                        gain.in();
                        gain.$ival.html(gain.i);
                        down=0;
                    }else{down=1;up=0;}
                }
            }
            v = this.cv;
        }
    });

    $("input.gravity").knob({
        min : 0,
        max : 100000,
        stopper : false,
        change : function () {
            if(v > this.cv){
                if(up){
                    gravity.de();
                    gravity.$ival.html(gravity.i);
                    up=0;
                }else{up=1;down=0;}
            } else {
                if(v < this.cv){
                    if(down){                        
                        gravity.in();
                        gravity.$ival.html(gravity.i);
                        down=0;
                    }else{down=1;up=0;}
                }
            }
            v = this.cv;
        }
    }); 

    $("input.restitution").knob({
        min : 0,
        max : 100000,
        stopper : false,
        change : function () {
            if(v > this.cv){
                if(up){
                    restitution.de();
                    restitution.$ival.html(restitution.i);
                    up=0;
                }else{up=1;down=0;}
            } else {
                if(v < this.cv){
                    if(down){                        
                        restitution.in();
                        restitution.$ival.html(restitution.i);
                        down=0;
                    }else{down=1;up=0;}
                }
            }
            v = this.cv;
        }
    });

    $("input.variance").knob({
        min : 0,
        max : 100000,
        stopper : false,
        change : function () {
            if(v > this.cv){
                if(up){
                    variance.de();
                    variance.$ival.html(variance.i);
                    up=0;
                }else{up=1;down=0;}
            } else {
                if(v < this.cv){
                    if(down){                        
                        variance.in();
                        variance.$ival.html(variance.i);
                        down=0;
                    }else{down=1;up=0;}
                }
            }
            v = this.cv;
        }
    });


    //Knobs in Effet
    $("input.delaytime").knob({
        min : 0,
        max : 100000,
        stopper : false,
        change : function () {
            if(v > this.cv){
                if(up){
                    delaytime.de();
                    delaytime.$ival.html(delaytime.i);
                    up=0;
                }else{up=1;down=0;}
            } else {
                if(v < this.cv){
                    if(down){                        
                        delaytime.in();
                        delaytime.$ival.html(delaytime.i);
                        down=0;
                    }else{down=1;up=0;}
                }
            }
            v = this.cv;
        }
    });                 

    $("input.delaygain").knob({
        min : 0,
        max : 100000,
        stopper : false,
        change : function () {
            if(v > this.cv){
                if(up){
                    delaygain.de();
                    delaygain.$ival.html(delaygain.i);
                    up=0;
                }else{up=1;down=0;}
            } else {
                if(v < this.cv){
                    if(down){                        
                        delaygain.in();
                        delaygain.$ival.html(delaygain.i);
                        down=0;
                    }else{down=1;up=0;}
                }
            }
            v = this.cv;
        }
    });                 
});