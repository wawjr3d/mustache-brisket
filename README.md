# mustache-brisket
Brisket TemplateAdapter for using Mustache js templates

Before you can use this adapter, check out [mustache.js](https://github.com/janl/mustache.js/).

## Usage

```js
import MustacheAdapter from "mustache-brisket";
import { View, Model } from "brisket";

const BaseView = View.extend({

    templateAdapter: MustacheAdapter

        // optional lookup for templates and partials
        .withTemplates({
            "partial1": "a global partial",
            "template1": "a template that can be referenced or " +
                    "used like {{#bold}}{{> partial1}}{{/bold}}",
        })

        // optional helpers that can be used in mustache template
        .withHelpers({
            bold: (text, render) => {
                return `<b>${render(text)}</b>`;
            }
        })

});

const ExampleView = BaseView.extend({

    // use an inline template
    template: "<span>hello {{hello}} {{modelHello}}</span> {{> partial1}}",

    logic() {
        return { "hello": "world" };
    }

});

model = new Model();
model.set("modelHello", "modelWorld");

view = new ExampleView({ model });

(new ExampleView()).render().el.innerHTML; // <span>hello world modelWorld</span> a global partial


const ExampleView2 = BaseView.extend({

    // use a template from the templates in BaseView
    template: "template1"

});

view = new ExampleView2();

(new ExampleView2()).render().el.innerHTML; // a template that can be referenced or used like <b>a global partial</b>
```
