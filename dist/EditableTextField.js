'use strict';

var React = require('react');
var __ = require('lodash');
var Button = require('react-bootstrap').Button;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Popover = require('react-bootstrap').Popover;
var Input = require('react-bootstrap').Input;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;

var EditableTextField = React.createClass({
    displayName: 'EditableTextField',

    getInitialState: function() {
        return {
            placeholder: '',
            isValid: true,
            rules: {
                '9' : /\d/,
                'M' : /\d/,
                'D' : /\d/,
                'Y' : /\d/
            }
        };
    },

    componentWillMount: function() {
        if (this.props.mask) {
            this.generatePlaceHolder(this.props.mask);
        }
    },

    componentDidMount: function() {
        if (this.props.value) {
            this.refs.input.value = this.applyMask(this.props.value);
        }
    },

    componentWillReceiveProps: function(nextProps) {
        // if (nextProps.value !===)
    },

    shouldComponentUpdate: function(nextProps, nextState) {
        if (nextProps.value !== this.props.value) {
            return true;
        }
        return false;
    },

    save: function save() {
        var value = this.refs.input.value;
        if (this.validate(value)) {
            this.refs.error.className = 'hidden text-danger';
            this.refs.error.innerHTML = '';
            this.props.onUpdate(this.props.name, this.refs.input.value);
            this.refs.overlay.hide();
        } else {
            this.refs.error.innerHTML = 'You\'ve entered invalid data!';
            this.refs.error.className = 'text-danger';
        }
    },

    validate: function validate(value) {
        var isValid = true;
        if (this.props.validation !== undefined && this.props.validation ) {
            isValid = false;
            var pattern = null;
            if (this.props.validation === 'date') {
                pattern = /^((19|20)[0-9]{2})-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
                if (this.props.mask !== undefined && this.props.mask === 'MM/DD/YYYY') {
                    pattern = /^(?:(0[1-9]|1[012])[\/.](0[1-9]|[12][0-9]|3[01])[\/.](19|20)[0-9]{2})$/;
                } else if (this.props.mask !== undefined && this.props.mask === 'DD/MM/YYYY') {
                    pattern = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
                }
            } else {
                pattern = new RegExp(this.props.validation);
                return pattern.test(value);
            }
            if (pattern) {
                return pattern.test(value);
            } else {
                return false;
            }
        }
        return isValid;
    },

    cancel: function cancel() {
        this.refs.overlay.hide();
    },

    submit: function submit(event) {
        event.preventDefault();
        this.save();
    },

    generatePlaceHolder: function generatePlaceHolder(mask){
        var placeholder = '';
        if (mask) {
            var rules = this.state.rules;
            mask = mask.split('');
            placeholder = mask.map(function(character){
                if (rules[character] !== undefined) {
                    return '_';
                }
                return character;
            });
            return placeholder;
        }
        this.setState({
            placeholder: placeholder
        });
    },

    processKeyUp: function processKeyUp(evt) {
        if (this.props.mask) {
            if (evt.keyCode !== 8 && evt.keyCode !== 46) {
                var value = this.refs.input.value;
                var oldStart = this.refs.input.selectionStart;
                var oldEnd = this.refs.input.selectionEnd;
                var newValue = this.applyMask(value);
                this.refs.input.value = newValue;
                if (newValue.indexOf('_') > -1) {
                    this.refs.input.selectionStart = newValue.indexOf('_');
                    this.refs.input.selectionEnd = this.refs.input.selectionStart + (oldEnd - oldStart);
                } else {
                    this.refs.input.selectionStart = oldStart;
                    this.refs.input.selectionEnd = oldEnd;
                }
            }
        }
    },

    applyMask: function applyMask(data) {
        var offset = 0;
        if (data) {
            if (this.props.mask) {
                data = data.split('');
                var rules = this.state.rules;
                var mask = this.props.mask.split('');
                var inputValues = mask.map( function(character, key) {
                    if (rules[character] === undefined) {
                        if (data[0] === character) {
                            return data.shift();
                        }
                        return character;
                    }
                    if (data.length === 0) {
                        return '_';
                    }
                    if (rules[character].test(data[0])){
                        return data.shift();
                    } else {
                        while (data.length) {
                            if (data[0] !== '_' && data[0] !== '-' && data[0] !== '/' && rules[character].test(data[0])) {
                                return data.shift();
                            }
                            data.shift();
                        }
                    }
                    return '_';
                }).join('');
                return inputValues;
            }
            return data;
        }
        return this.state.placeholder;
    },

    onOverlayShow: function(){
        this.refs.input.value = this.applyMask(this.props.value);
    },

    render: function render() {
        var placeholder = this.state.placeholder;
        var empty = this.props.value === "";
        var appliedValue = this.applyMask(this.props.value);
        var linkText = empty ? 'Empty' : appliedValue
        var linkClass = empty ? 'editable-click editable-empty' : 'editable-click';
        var self = this;
        var popover = React.createElement(
            Popover,
            {id: 'xeditable_input_popover'},
            React.createElement(
                'form',
                { className: 'form-inline', onSubmit: this.submit },
                React.createElement(
                    'input',
                    {
                        type: 'text',
                        ref: 'input',
                        placeholder: 'Empty',
                        className: 'input-sm form-control',
                        onKeyUp: this.processKeyUp
                    }
                ),
                React.createElement(
                    'div',
                    {
                        ref: 'error',
                        className: 'text-danger hidden'
                    },
                    ''
                ),
                React.createElement(
                    ButtonToolbar,
                    { className: 'editable-buttons' },
                    React.createElement(
                        Button,
                        { bsStyle: 'primary', className: 'btn-sm', onClick: this.save },
                        React.createElement('i', { className: 'glyphicon glyphicon-ok' })
                    ),
                    React.createElement(
                        Button,
                        { bsStyle: 'default', className: 'btn-sm', onClick: this.cancel },
                        React.createElement('i', { className: 'glyphicon glyphicon-remove' })
                    )
                )    
            )
        );

        return React.createElement(
            OverlayTrigger,
            { ref: 'overlay', trigger: 'click', rootClose: true, placement: 'bottom', overlay: popover, onEnter: this.onOverlayShow },
            React.createElement(
                'a',
                { href: 'javascript:;', className: linkClass },
                linkText
            )
        );
    }
});

module.exports = EditableTextField;