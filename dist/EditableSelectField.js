'use strict';

var React = require('react');

var Button = require('react-bootstrap').Button;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;
var Popover = require('react-bootstrap').Popover;
// var FormControl = require('react-bootstrap').InputGroup;
var ButtonToolbar = require('react-bootstrap').ButtonToolbar;
var __ = require('lodash');

var EditableSelectField = React.createClass({
    displayName: 'EditableSelectField',
    getDefaultProps: function getDefaultProps() {
        return {
          value: null
        };
    },

    save: function save() {
        this.props.onUpdate(this.props.name, this.refs.input.value);
        this.refs.overlay.hide();
    },

    cancel: function cancel() {
        this.refs.overlay.hide();
    },

    submit: function submit(event) {
        event.preventDefault();
        this.save();
    },

    renderOptions: function renderOptions(options) {
        var opts = []
        opts.push(React.createElement("option", { value: '', key: 'key' }, ''));
        for (var count = 0; count < options.length; count++) {
            opts.push(React.createElement("option", { value: options[count].id, key: count }, options[count].value));
        }
        return opts;
    },

    render: function render() {
        var empty = (this.props.value === "" || this.props.value === null);
        var linkText = empty ? 'Empty' : this.props.value;
        var linkClass = empty ? 'editable-click editable-empty' : 'editable-click';
        var defaultValue = __.find(this.props.options, function(o) { return o.id == linkText; }) || {value: 'Empty'};
        linkText = defaultValue.value;

        var popover = React.createElement(
            Popover,
            { id: 'xeditable_select_popover' },
            React.createElement(
                'form',
                { className: '', onSubmit: this.submit },
                React.createElement(
                    'select',
                    { type: 'select', style: {padding: 10, marginBottom: 10}, id: 'xeditable_select', ref: 'input', placeholder: 'Select', className: 'input-md', defaultValue: this.props.value},
                    this.renderOptions(this.props.options)
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
            { ref: 'overlay', id: 'xeditable_select_popover_main', trigger: 'click', rootClose: true, placement: 'bottom', overlay: popover },
            React.createElement(
                'a',
                { href: 'javascript:;', className: linkClass },
                linkText
            )
        );
    }
});

module.exports = EditableSelectField;