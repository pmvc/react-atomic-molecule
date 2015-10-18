var React = require('react');
var ReactStyle = require('../../src/lib/styles/index');
var SemanticUI = require('../molecules/semantic_ui.jsx');
var mixClass = require('classnames');
var _blockMouseEvents;


var styles = ReactStyle({
    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
    WebkitTouchCallout: 'none',
    userSelect: ['none'],
    cursor: 'pointer'
});

function getTouchProps(touch) {
    if (!touch){
        return {};
    }
    return {
        pageX: touch.pageX,
        pageY: touch.pageY,
        clientX: touch.clientX,
        clientY: touch.clientY
    };
}


/**
 * Tappable Component
 * ==================
 */

export default class Tappable extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            isActive: false,
            touchActive: false
        };
    }
	
	componentWillUnmount() {
		this.cleanupScrollDetection();
		this.cancelPressDetection();
	}
	
	processEvent(event) {
		if (this.props.preventDefault){
                    event.preventDefault();
                }
		if (this.props.stopPropagation){
                    event.stopPropagation();
                }
	}
	
	onTouchStart(event) {
		if (this.props.onTouchStart && this.props.onTouchStart(event) === false) {
                    return;
                }
		this.processEvent(event);
		_blockMouseEvents = true;
		this._initialTouch = this._lastTouch = getTouchProps(event.touches[0]);
		this.initScrollDetection();
		this.initPressDetection(this.endTouch);
		this.setState({
			isActive: true
		});
	}
	
	initScrollDetection() {
		this._scrollParents = [];
		this._scrollPos = { top: 0, left: 0 };
		var node = this.getDOMNode();
		while (node) {
			if (node.scrollHeight > node.offsetHeight || node.scrollWidth > node.offsetWidth) {
				this._scrollParents.push(node);
				this._scrollPos.top += node.scrollTop;
				this._scrollPos.left += node.scrollLeft;
			}
			node = node.parentNode;
		}
	}
	
	calculateMovement(touch) {
		return {
			x: Math.abs(touch.clientX - this._initialTouch.clientX),
			y: Math.abs(touch.clientY - this._initialTouch.clientY)
		};
	}
	
	detectScroll() {
		var currentScrollPos = { top: 0, left: 0 };
		for (var i = 0; i < this._scrollParents.length; i++) {
			currentScrollPos.top += this._scrollParents[i].scrollTop;
			currentScrollPos.left += this._scrollParents[i].scrollLeft;
		}
		return !(currentScrollPos.top === this._scrollPos.top && currentScrollPos.left === this._scrollPos.left);
	}
	
	cleanupScrollDetection() {
		this._scrollParents = undefined;
		this._scrollPos = undefined;
	}
	
	initPressDetection(callback) {
		if (!this.props.onPress) {
                    return;
                }
		this._pressTimeout = setTimeout(function() {
			this.props.onPress();
			callback();
		}.bind(this), this.props.pressDelay);
	}
	
	cancelPressDetection() {
		clearTimeout(this._pressTimeout);
	}
	
	onTouchMove(event) {
		if (!this._initialTouch) {
                    return;
                }
		this.processEvent(event);
		if (this.detectScroll()) {
                    return this.endTouch(event);
		}
		this.props.onTouchMove && this.props.onTouchMove(event);
		this._lastTouch = getTouchProps(event.touches[0]);
		var movement = this.calculateMovement(this._lastTouch);
		if (movement.x > this.props.pressMoveThreshold || movement.y > this.props.pressMoveThreshold) {
			this.cancelPressDetection();
		}
		if (movement.x > this.props.moveThreshold || movement.y > this.props.moveThreshold) {
			if (this.state.isActive) {
				this.setState({
					isActive: false
				});
			}
		} else {
			if (!this.state.isActive) {
				this.setState({
					isActive: true
				});
			}
		}
	}
	
	onTouchEnd(event) {
            if (!this._initialTouch){
                return;
            }
            this.processEvent(event);
            var movement = this.calculateMovement(this._lastTouch);
            if (movement.x <= this.props.moveThreshold && movement.y <= this.props.moveThreshold) {
                this.props.onTap && this.props.onTap(event);
            }
            this.endTouch(event);
	}
	
	endTouch(event) {
		this.cancelPressDetection();
		this.props.onTouchEnd && this.props.onTouchEnd(event);
		this._initialTouch = null;
		this._lastTouch = null;
		this.setState({
			isActive: false
		});
	}
	
	onMouseDown(event) {
		if (_blockMouseEvents) {
                    _blockMouseEvents = false;
                    return;
		}
		if (this.props.onMouseDown && this.props.onMouseDown(event) === false) {
                    return;
                }
		this.processEvent(event);
		this.initPressDetection(this.endMouseEvent);
		this._mouseDown = true;
		this.setState({
			isActive: true
		});
	}
	
	onMouseMove(event) {
		if (_blockMouseEvents || !this._mouseDown){
                    return;
                }
		this.processEvent(event);
		this.props.onMouseMove && this.props.onMouseMove(event);
	}
	
	onMouseUp(event) {
		if (_blockMouseEvents || !this._mouseDown) {
                    return;
                }
		this.processEvent(event);
		this.props.onMouseUp && this.props.onMouseUp(event);
		this.props.onTap && this.props.onTap(event);
		this.endMouseEvent();
	}
	
	onMouseOut(event) {
		if (_blockMouseEvents || !this._mouseDown){
                    return;
                }
		this.processEvent(event);
		this.props.onMouseOut && this.props.onMouseOut(event);
		this.endMouseEvent();
	}
	
	endMouseEvent() {
		this.cancelPressDetection();
		this._mouseDown = false;
		this.setState({
			isActive: false
		});
	}
	
	render() {
            var className = this.props.classBase + (this.state.isActive ? '-active' : '-inactive');
            var classes = mixClass(
                this.props.className
                ,className
            );
            return (
                <SemanticUI
                    {...this.props}
                    styles={[styles,this.props.styles]}
                    ui={false}
                    className={classes}
                    onTouchStart={this.onTouchStart.bind(this)}
                    onTouchMove={this.onTouchMove.bind(this)}
                    onTouchEnd={this.onTouchEnd.bind(this)}
                    onMouseDown={this.onMouseDown.bind(this)}
                    onMouseMove={this.onMouseMove.bind(this)}
                    onMouseUp={this.onMouseUp.bind(this)}
                    onMouseOut={this.onMouseOut.bind(this)}
                >{this.props.children}</SemanticUI>
            );
	}
	
}
Tappable.propTypes ={
    className: React.PropTypes.string,           // optional className
    classBase: React.PropTypes.string,           // base for generated classNames
    disabled: React.PropTypes.bool,              // only applies to buttons
    
    moveThreshold: React.PropTypes.number,       // pixels to move before cancelling tap
    pressDelay: React.PropTypes.number,          // ms to wait before detecting a press
    pressMoveThreshold: React.PropTypes.number,  // pixels to move before cancelling press
    preventDefault: React.PropTypes.bool,        // whether to preventDefault on all events
    stopPropagation: React.PropTypes.bool,       // whether to stopPropagation on all events
    
    onTap: React.PropTypes.func,                 // fires when a tap is detected
    onPress: React.PropTypes.func,               // fires when a press is detected
    onTouchStart: React.PropTypes.func,          // pass-through touch event
    onTouchMove: React.PropTypes.func,           // pass-through touch event
    onTouchEnd: React.PropTypes.func,            // pass-through touch event
    onMouseDown: React.PropTypes.func,           // pass-through mouse event
    onMouseUp: React.PropTypes.func,             // pass-through mouse event
    onMouseMove: React.PropTypes.func,           // pass-through mouse event
    onMouseOut: React.PropTypes.func             // pass-through mouse event
};

Tappable.defaultProps = {
    classBase: 'Tappable',
    moveThreshold: 100,
    pressDelay: 1000,
    pressMoveThreshold: 5
};
