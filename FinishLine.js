'use strict';

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
     * @param {jQuery Object} goal - jQuery object of goal
     * @param {Boolean} north - Want to register events scrolling up instead of the default of down
     * @param {Integer} offset - How many pixels before the goal
     */
    this.options = options;
    this.$node = $(this.options.node);
};

/**
 * Show options associated with this FinishLine
 * @return {Boolean}
 */
FinishLine.prototype.logOptions = function(){
    console.log(this.options);
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
    return this.$node.hasClass(this.options.modifier);
};

/**
 * Run to the finish line
 * Checks whether the modifier should be
 * enabled or not based on scroll position
 * @return {Boolean}
 */
FinishLine.prototype.run = function(){
    var
    winScroll    = $(window).scrollTop(),
    goalOffset   = this.options.goal.offset(),
    finishOffset = this.options.offset ? this.options.offset : 0,
    goNorth      = this.options.north ? true : false,
    goal         = goNorth ? goalOffset.top : goalOffset.top + this.options.goal.outerHeight(),
    finishLine   = goNorth ? goal - finishOffset : goal + finishOffset,
    hasWon       = goNorth ? winScroll <= finishLine : winScroll >= finishLine;

    if(hasWon){
        this.$node.addClass(this.options.modifier);
        return true;
    }
    else{
        this.$node.removeClass(this.options.modifier);
        return false;
    }
};

/**
 * Deactivate the state
 * @return {Boolean}
 */
FinishLine.prototype.deactivate = function() {
    this.$node.removeClass(this.options.activeState);
    return true;
};

module.exports = FinishLine;