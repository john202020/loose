### Loose
It provides a clean communication between web components, and user interface.
It focus on listening.

### Inspired by Knockout observable
Inspired by the knockoutjs observable, we are happy to presence the observable style listening.

For backward compatible documentation, check [readme-1.0.4.md](https://github.com/john202020/loose/blob/master/Readme-1.0.4.md).

### Usage of observable style listening
To use the observable style listening, just retrieve the observable constructor and call listeners on it, without the callback function.
Instead, the callback function will now be placed in the subscription of an observable.

```javascript

var loose = require("loose")();

// retrieve the observable constructor.
var ob = loose.ob;

//return
//  ko.observable({
//      values: {},
//      dom: DOM document or DOM element
//  });
var a_name_clicked = ob.listen("click", "a.name"); // listen to clicked on <a class='name'> event
var custom_call_to_close_others = ob.listen("everyone else should be closed"); // listen to custom event

a_name_clicked.subscribe(
    function(value){
        var values = value.values ;
        var dom = value.dom; //the DOM anchor element
    }
);

custom_call_to_close_others.subscribe(
    function(value){
        var values = value.values ; // values be {}
        var dom = value.dom; //the DOM document
    }
);

loose.notify("everyone else should be closed");
```

### API

__notify(values, 'event name');__

Send ``custom event``
``values`` optional. 

If ``values`` exists, it will first be json stringified and parse back when listened. 
If undefined, or null, will be turned to {}.

```javascript

notify({id:12}, 'just added a new person');
notify('call all to be alerted');

```


### Depedency
It depends on jquery (at least v.1.7) to emit and listen javascript event, 
and knockoutjs to extend the observable style listening.
