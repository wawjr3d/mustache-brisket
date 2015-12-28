"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _brisket = require("brisket");

var _mustache = require("mustache");

var _mustache2 = _interopRequireDefault(_mustache);

var originalLookup = _mustache2["default"].Context.prototype.lookup;

var MustacheAdapter = _brisket.Templating.TemplateAdapter.extend({

    templates: {},

    withTemplates: function withTemplates(templates) {
        if (!templates) {
            return;
        }

        this.templates = templates;

        return this;
    },

    withHelpers: function withHelpers(helpers) {
        if (!helpers) {
            return;
        }

        _mustache2["default"].Context.prototype.lookup = function (name) {
            return originalLookup.apply(this, arguments) || helpers[name];
        };

        return this;
    },

    templateToHTML: function templateToHTML(templateId, data) {
        var template = this.templates[templateId] || templateId;

        return _mustache2["default"].render(template, data, this.templates);
    }

});

exports["default"] = MustacheAdapter;
module.exports = exports["default"];