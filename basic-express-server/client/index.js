document.addEventListener('DOMContentLoaded', () => {

    console.log('Running index.js in browser');


    // =========================  Virtual DOM Component Class Prototype  ========================= 
    const ROOT = document.getElementById('ROOT');

    let _globalVDOMIndex = {};
    _globalVDOMIndex = document.childNodes.push();


    // THIS NEEDS WORK. If the component is a string, then it won't have the property 'id' (or any properties).
    // Mostly trying to minimize actual DOM updates where possible.
    const updateDOM = (component, cb) => {
        let target = document.querySelectorAll(component.id);

        // if (component === String(component)) {
        //     target.innerHTML = component;       /* If the component returns only a string of HTML code,
        //                                         then just add the string to the innerHTML for performance reasons.*/
        // }

        if (component instanceof Object) {
            let childArray = [];
            target.children.forEach((e) => {
                childArray.push(e)
            });
            target.innerHTML = '';              // Clear out all the child nodes in DOM. Let the garbage collector clean that up...
            childArray.forEach((e) => {
                target.appendChild(e);
            });
            cb(component);    
        }
    }



    class VDOMComponent {
        constructor(id, props = {}) {
            this.id = () => id = (!undefined && !null) ? String(id) : new TypeError(`INVALID_ARGUMENT: 'id' is ${typeof(id)}`);
            this.props = props;
            this.state = state;
            this.setState = this.setState.bind(this);
            this.render = this.render.bind(this);
            this.createUUID = this.createUUID.bind(this);
        }
        setState(newState = {}, callback) {
            Object.keys(newState).forEach((x) => {
                this.state[x] = newState[x];
            });
            if (callback) callback(this.state);
            return;
        }
        // Not sure if this is the right set of functions/args..
        // Takes a string of HTML code (unsanitized), calls the global update DOM function,
        // which returns a callback, which should return the new component
        render(htmlString) {
            let cbfn = (x) => {return x}
            updateDOM({id: this.id, htmlString: htmlString, state: this.state, props: this.props}, cbfn);
            cbfn(renderedComponent);
        }
        createUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });        
        }
    }
});


/*
=============================================================================
==================================  NOTES  ==================================
=============================================================================

// When rendering the component tree, we are essentially calling the 'render()' method of each component:

____________________________________________________________
        import Body from './components/body';

        class App extends VDOMComponent {
            constructor(id, props={}, state={}) {
                this.id = id;
                this.props = props;
                this.state = state;
            }
            render(`
                <div id="${this.id}">
                    ${Body.render()}     <----------- This is the important part. We are calling the 'render()' method of the sub-component.
                </div>
            `);
        }
____________________________________________________________

// Then in the 'Body' component, we will have:
____________________________________________________________
        import Header from './header';

        class Body extends VDOMComponent {
            constructor(id, props={}, state={}) {
                this.id = id;
                this.props = props;
                this.state = state;
            }
            render(`
                <div id="${this.id}">
                    ${Header.render()}     <----------- Same thing here. We are calling the 'render()' method of 'Header'.
                </div>
            `);
        }
____________________________________________________________

// And so on down the tree...
// Thus, the insertion point (<div id="ROOT"></div>) will contain a string of HTML
// which is the result of a chain of functions returning their own bits of HTML to the
// top of the tree.

// The initial render should run through the entire relevant component tree. Then, some of the components will
// be designed with event listeners, that will trigger various 'render()' or 'setState()' (which calls 'render()')
// triggering a local 'render()' chain.

// From that point, each component will call its own 'render()' method each time it changes state
// (i.e. its 'setState()' method is called, and at least one property of 'state' has changed),
// or when one of its props has changed.

// The global function 'updateDOM()' should remove components from a 'componentIndex' object based whether
// their states/properties/attributes have changed, and remove their associated DOM nodes.

// This componentIndex should map components to their DOM nodes. Then it should test each component to
// see if it has changed. If it HAS changed, then the key/value pair in the index should be updated,
// and the DOM node in question should be replaced.

// If a component is not an instance of VDOMComponent, and simply returns a string of HTML code,
// then it shouldn't need to have a DOM node associated with it. It should just be added to a parent
// node's 'innerHTML' property.
// ---------------> (Need to check whether DOM nodes are created for each HTML element, even when rendered as 'innerHTML')

*/