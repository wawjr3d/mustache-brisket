import MustacheAdapter from "../lib/MustacheAdapter";
import { View, Testing, Model } from "brisket";

import { expect } from "chai";

describe("README", function() {
    var BaseView;
    var view;
    var model;

    beforeEach(function() {
        Testing.setup();

        BaseView = View.extend({

            templateAdapter: MustacheAdapter
                .withTemplates({
                    "partial1": "a global partial",
                    "template1": "a template that can be referenced or " +
                            "used like {{#bold}}{{> partial1}}{{/bold}}",
                })
                .withHelpers({
                    bold: (text, render) => {
                        return `<b>${render(text)}</b>`;
                    }
                })

        });
    });

    it("won't make me look stupid by not working", function() {
        const ExampleView = BaseView.extend({

            template: "<span>hello {{hello}} {{modelHello}}</span> {{> partial1}}",

            logic() {
                return { "hello": "world" };
            }

        });

        model = new Model();
        model.set("modelHello", "modelWorld");

        view = new ExampleView({ model });

        expect(view.render().el.innerHTML).to.equal(
            "<span>hello world modelWorld</span> a global partial"
        );

        const ExampleView2 = BaseView.extend({

            template: "template1"

        });

        view = new ExampleView2();

        expect(view.render().el.innerHTML).to.equal(
            "a template that can be referenced or used like <b>a global partial</b>"
        );

    });

});
