### Loose
It provides a clean communication between web components, and user interface. 
It focus on listening. 

### Caution
Only put non heavy loading codes inside a listener. 

### Usage
Each web component class (or wrapper) should have at least one ``loose`` object.

```javascript
var loose = require("loose")();
```

__DOM event__
```javascript
loose.listen(
    function(values){
        this; // values is {}, 'this' is the DOM anchor element
    },  "click", "a.name" // listen to clicked on <a class='name'> event
);
```

```javascript
loose.listenDocument(
    function(values){
        this; // values is {}, 'this' is the DOM document
    },  "click" // listen to clicked on DOM document
);
```
```javascript
loose.listenElement(
    function(values){
        this; // values is {}, 'this' is the DOM element
    },  "click" // listen to clicked on DOM element
);
```

```javascript
loose.listen(
    function(values){
        this; // values is {}, 'this' is the DOM document or DOM element
    },  "click" // listen to any clicked event
);
```

```javascript
loose.listen(
    function(values){
	    this; // values is {}, the DOM li elemnt
	},  "mouseover", "li.name" // listen to mouseover on <li class='name'>
);
```

__Custom event__
``notify()``

```javascript
loose.notify( true, 'alert boolean event');
```

Listen to its own ``loose``.
```javascript
loose.listenSelf(
    function(values){
        console.log("I have send a boolean: " + values);
    },	"alert boolean event" // custom event
);
```

Listen to other ``loose``.
```javascript
loose.listenOthers(
    function(values){
        console.log("Other have just send a boolean: " + values);
    },  "alert boolean event" // custom event
);
```

Listen to all ``loose`` and the ``environment``. In other words, all events.
```javascript
loose.listen(
    function(values){
        console.log("A loose object just send a boolean: " + values);
    },  "alert boolean event" // custom event
);
```
```javascript
loose.listen(
    function(values){
        console.log("some one just click");
    }, 
    "click",    // DOM event
    "a"         // DOM element
);
```

__Enabled or disable__
```javascript
loose.disable();  // stop all activities of this loose
```
```javascript
loose.enable();  // enable all activities of this loose
```
```javascript
loose.isEnable();  // return boolean
```

__Chaining listener, notifier__
```javascript
lc
.listen(callbackfunction,  'evet name', 'DOM element selector')
.listenSelf(allbackfunction,  'evet name')
.listenOthers(allbackfunction,  'evet name')
.notify(values, 'event name');
```

__Dispose all event listening up to the moment of invocation__
```javascript
loose.dispose(); 
```

__Dispose only registered dispose event listening up to the moment of invocation__

First add ``true`` argument to the listener

```javascript
loose.listen(true,	callbackfunction, 'click');
```
```javascript
loose.listen(true,	callbackfunction, 'something happens');
```
```javascript
loose.listenDocument(true,	callbackfunction, 'click');
```
```javascript
loose.listenElement(true,	callbackfunction, 'click', 'a');
```
```javascript
loose.listenSelf(true,	callbackfunction, 'submitfail event');
```
```javascript
loose.listenOthers(true, callbackfunction, 'delete item success event');
```
```javascript
loose.disposeRegistered();
```


### Elaboration
Each web component class should have at least one ``loose`` object.
``listen``will pick an event based on the ``event signature``. 
``event signature`` has at least one argument (event name). 

Two types of event. ``DOM event`` and ``custom event``

``DOM document`` or ``DOM element`` ==> ``DOM event``

``notify()`` ==> ``custom event``

Three variations of ``event signature``. They are:
```javascript
('click', 'a.name'); // anchor clicked event
```
```javascript
('click'); // all clicked event
```
```javascript
('custom event'); // custom event
```

Listen to ``custom event``.
```javascript
listen(callbackfunction, 'custom event name');
```

Listen to ``DOM event``. 
``DOM event`` can have an optional ``DOM element selector``. 
```javascript
listen(callbackfunction, 'DOM event name', 'DOM element selector');
```

``DOM event`` can have multiple event names separated by space.
This is based on jquery event triggering structure.
e.g.
```javascript
listen(callbackfunction, 'keydown mousedown', 'input');
```

There are four variations of listener, namely ``listen``, ``listenDocument``, ``listenSelf`` and ``listenOthers``.
Both ``listenSelf`` and ``listenOthers`` matches only the ``custom event`` (ignoring ``DOM element selector``).

``listen`` to click events on the \<a class='name'></a>. 
```javascript
listen(callbackfunction, 'click', 'a.name');
```

``listen`` to click events only from the DOM document. 
```javascript
listenDocument(callbackfunction, 'click');
```

``listen`` to events all ``loose``. 
```javascript
listen(callbackfunction, 'custom event');
```

``listenSelf`` to events only from its own ``notify()``. 
```javascript
listenSelf(callbackfunction, 'custom event'); 
```

``listenOthers`` to events only from other ``notify()``.
```javascript
listenOthers(callbackfunction, 'custom event');
```

__more on ``notify()``__

``values`` of ``notify(values, 'event name')`` will first be json stringified and parse back when listened. 
Sending ``null`` will be converted to {}.
Sending ``undefined`` will cause error thrown. 

If setting a ``custom event`` to a DOM (or html5) event name, e.g. 'click', error will be thrown.

```javascript
notify({id:'12'}, 'Success. Newly added id event');
```
```javascript
notify({id:'12'}, 'click'); // error thrown!!!
```

### API

__(enable or disable);__

Instantiation. Default is enable
```javascript
var lc = require("loose")();
```


__listen([ is registered dispose, ] callbackfunction, 'event name', 'optional dom element selector');__

e.g.
Listen to anchor clicked event (e.g. ("click", "a.name") clicked \<a class='name'>)
``values`` is {}.
``this`` is the clicked \<a class="name"> DOM element
```javascript
listen(function(values){this;}, 'click', 'a.name');
```

Listen all clicked event
``values`` is {}.
``this`` is the DOM document
```javascript
listen(function(values){this;}, 'click');
```

Listen to all custom event.
``values`` is {}.
``this`` is the DOM document
```javascript
listen(function(values){this;}, 'custom event');
```


__listenDocument([ is registered dispose, ] callbackfunction, 'custom event or DOM event', [, 'DOM element selector']);__

Listen only to DOM document event.
``values`` is {} by default.
``this`` is the DOM document
```javascript
listenDocument(function(values){this;}, 'click');
```

__listenElement([ is registered dispose, ] callbackfunction, 'DOM event', 'DOM element selector');__

Listen only to DOM element event.
``values`` is {} by default.
``this`` is the DOM element
```javascript
listenElement(function(values){this;}, 'click', 'a');
```

__listenSelf([ is registered dispose, ] callbackfunction, 'custom event');__

Listen to its own custom event.
``values`` is {} by default.
``this`` is the DOM document
```javascript
listenSelf(function(values){this;}, 'custom event');
```

__listenOthers([ is registered dispose, ] function(values){}, 'custom event');__

Listen to others' custom event.
``values`` is {}.
``this`` is the DOM document
```javascript
listenOthers(function(values){this}, 'custom event');
```

__notify(values, 'event name');__

Send ``custom event``
``values`` will first be json stringified and parse back when listened. 
``values``: if undefined, cause error thrown, if null, will be turned to {}.
```javascript
notify({id:12}, 'just added a new person');
```

Disable temporary all the action and reaction
```javascript
disable();
```

Enable all the action and reaction
```javascript
enable();
```

Return boolean
```javascript
isEnable();
```

Disconnect and remove all listener(s) that are up to the moment at invocation,
Does not affect listening attached afterwards.
Does not change the state of isEnable().
```javascript
dispose();
```

Disconnect and remove all registered dispose listener(s) that are up to the moment at invocation,
Does not affect listening attached afterwards.
Does not change the state of isEnable().
```javascript
loose.disposeRegistered();
```

### Depedency
It depends on jquery (at least v.1.7) to emit and listen javascript event.

### Further development
This library is on its initial stage. A lot more can be implemented. We suggest following pending development.

1. eliminate circular event
2. elminate event competing
