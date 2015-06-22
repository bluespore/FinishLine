'use strict'

/**
 * FinishLine indicates a state change when the
 * page scrolls to or past a certain point, reversing
 * the state change when passing back through the 'finish line'
 */
var FinishLine = function(options){

    if(typeof options !== "object"){
        console.error('Finish Line options set incorrectly');
        return false;
    }

    /**
     * Module options.
     * Expected Params
     * @param {String} node - Selector of element to bind to
     * @param {String} modifier - modifier class name
     * @param {jQuery Object} startLine - jQuery object of startLine
     * @param {jQuery Object} finishLine - jQuery object of finishLine
     * @param {Boolean} north - Want to register events scrolling up instead of the default of down
     * @param {Integer} startOffset - How many pixels before the start point
     * @param {Integer} finishOffset - How many pixels before the finish point
     * @param {String} orientation - left/right oriented
     * @param {Integer} killWidth - minimum screen width to run
     */
    this.options = options;
    this.$node = $( this.options.node );

};

/**
 * Show options associated with this FinishLine
 * @return {Boolean}
 */
FinishLine.prototype.logOptions = function(){
    console.log( this.options );
    return true;
};

/**
 * Get options
 * @return {object} Module options
 */
FinishLine.prototype.getOptions = function(){
    return this.options;
};

/**
 * Check if modifier class has been added
 * @return {Boolean} hasClass result
 */
FinishLine.prototype.isActive = function(){
    return this.$node.hasClass( this.options.runningModifier );
};

/**
 * Run to the finish line
 * Checks whether the modifier should be
 * enabled or not based on scroll position
 * @return {Boolean}
 */
FinishLine.prototype.run = function(){

    if( $(window).width() <= this.options.killWidth
        || !this.$node.length > 0
        || !this.options.startLine.length > 0
        || !this.options.finishLine.length > 0){

        this.deactivate();
        return false;

    }

    var
    winScroll     = $(window).scrollTop(),
    north         = this.options.north ? true : false,

    startLinePos  = this.options.startLine.offset(),
    startOffset   = this.options.startOffset ? this.options.startOffset : 0,
    startPoint    = north ? startLinePos.top : startLinePos.top + this.options.startLine.outerHeight(),
    startTrigger  = north ? startPoint - startOffset : startPoint + startOffset,

    finishLinePos = this.options.finishLine.offset(),
    finishOffset  = this.options.finishOffset ? this.options.finishOffset : 0,
    finishPoint   = north ? finishLinePos.top + this.options.finishLine.outerHeight() : finishLinePos.top,
    finishTrigger = north ? finishPoint - finishOffset : finishPoint + finishOffset,

    isRunning     = north ? winScroll <= startTrigger : winScroll >= startTrigger,
    hasCompleted  = north ? winScroll <= (finishTrigger - this.options.finishLine.outerHeight()) : winScroll >= (finishTrigger - this.options.finishLine.outerHeight());

    if( isRunning ){
        this.$node.addClass( this.options.runningModifier );
        $('body').addClass( this.options.bodyClass );
    }
    else{
        this.$node.removeClass( this.options.runningModifier );
        $('body').removeClass( this.options.bodyClass );
    }

    /**
     * If has completed, set position absolute
     * and set to a position just above where
     * the finishLine sits.
     */
    if( hasCompleted ){

        $('body').removeClass( this.options.bodyClass );

        this
        .$node
        .removeClass( this.options.runningModifier )
        .addClass( this.options.finishModifier )
        .css({
            'top': finishTrigger + parseInt(finishOffset)
        });

    }
    else{
        this
        .$node
        .attr('style', '')
        .removeClass( this.options.finishModifier );
    }

};

/**
 * Deactivate the state
 * @return {Boolean}
 */
FinishLine.prototype.deactivate = function() {
    this
    .$node
    .removeClass( this.options.runningModifier )
    .removeClass( this.options.finishModifier );

    $('body').removeClass( this.options.bodyClass );

    return true;
};

module.exports = FinishLine;