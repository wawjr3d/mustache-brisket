import MustacheAdapter from "../lib/MustacheAdapter";
import { View, Testing, Model } from "brisket";

import { expect } from "chai";
import chai from "chai";

chai.Assertion.addMethod("sameHtmlAs", function(expected) {
    var obj = this._obj;

    var expectedMessage = `expected #{this} to be same html as ${expected}`;
    var notExpectedMessage = `expected #{this} to not be same html as ${expected}`;

    var normalizedObj = minifyHtml(obj);
    var normalizedExpected = minifyHtml(expected);

    var assertion = normalizedObj === normalizedExpected;

    this.assert(assertion, expectedMessage, notExpectedMessage);
});

function minifyHtml(string) {
    return string
        .replace(/^\s+|\s+$/gm, "")
        .replace(/\n/gm, " ")
        .replace(/\s+(\<\/)/, " $1")
        .replace(/(\>)\s+/, "$1 ");
}

describe("MustacheAdapter", function() {
    var view;
    var ExampleView;
    var model;
    var templates;

    beforeEach(function() {
        Testing.setup();
    });

    it("renders mustache templates", function() {
        ExampleView = View.extend({

            templateAdapter: MustacheAdapter,

            template: `
                <span class='test'>
                    {{#bold}}some{{/bold}} {{some}}
                </span>
            `,

            logic() {
                return {
                    some: "data",
                    bold: () => {
                        return (text) => {
                            return `<b>${text}</b>`;
                        };
                    }
                };
            }

        });

        view = new ExampleView();

        view.render();

        expect(view.el.innerHTML).to.be.sameHtmlAs(`
            <span class="test">
                <b>some</b> data
            </span>
        `);
    });

    it("resolves template from templates you provided", function() {
        ExampleView = View.extend({

            templateAdapter: MustacheAdapter
                .withTemplates({
                    example: "<span class='test'></span>"
                }),

            template: "example"

        });

        view = new ExampleView();

        view.render();

        expect(view.el.innerHTML).to.sameHtmlAs('<span class="test"></span>');
    });

    it("resolves partials from templates you provide", function() {
        ExampleView = View.extend({

            templateAdapter: MustacheAdapter
                .withTemplates({
                    "modelPartial": "model: {{modelKey}}",
                    "logicPartial": "logic: {{logicKey}}"
                }),

            template: `
                <span class="test">
                    {{> modelPartial}},
                    {{> logicPartial}}
                </span>
            `,

            logic() {
                return { "logicKey": "logic-value" };
            }

        });

        model = new Model();
        model.set("modelKey", "model-value");

        view = new ExampleView({ model });

        view.render();

        expect(view.el.innerHTML).to.be.sameHtmlAs(`
                <span class="test">
                    model: model-value,
                    logic: logic-value
                </span>
            `);
    });

    it("throws error when template is invalid", function() {
        ExampleView = View.extend({

            templateAdapter: MustacheAdapter,

            template: 123

        });

        view = new ExampleView();

        expect(function() {
            view.render();
        }).to.throw(Error);
    });

    it("uses local function over global helper", function() {
        ExampleView = View.extend({

            templateAdapter: MustacheAdapter
                .withHelpers({
                    bold: (text, render) => {
                        return `<strong>${render(text)}</strong>`;
                    }
                }),

            template: "{{#bold}}hershel{{/bold}} and {{#ice}}{{cold}}{{/ice}}",

            logic: function() {
                return {
                    bold: () => {
                        return (text, render) => {
                            return `<b>${render(text)}</b>`;
                        };
                    },
                    ice: {
                        name: "3 stacks"
                    },
                    cold: function() {
                        return this.name;
                    }
                }
            }

        });

        view = new ExampleView();

        view.render();

        expect(view.el.innerHTML).to.sameHtmlAs('<b>hershel</b> and 3 stacks');
    });

});
