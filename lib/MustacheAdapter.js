import { Templating } from "brisket";
import Mustache from "mustache";

const originalLookup = Mustache.Context.prototype.lookup;

const MustacheAdapter = Templating.TemplateAdapter.extend({

    templates: {},

    withTemplates: function(templates) {
        if (!templates) {
            return;
        }

        this.templates = templates;

        return this;
    },

    withHelpers: function(helpers) {
        if (!helpers) {
            return;
        }

        Mustache.Context.prototype.lookup = function(name) {
            return originalLookup.apply(this, arguments) || helpers[name];
        };

        return this;
    },

    templateToHTML: function(templateId, data) {
        var template = this.templates[templateId] || templateId;

        return Mustache.render(template, data, this.templates);
    }

});

export default MustacheAdapter;
