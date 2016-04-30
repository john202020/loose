### Inspired by Knockoutjs and Rxjs
For backward compatible documentation, 
check [readme-1.0.4.md](https://github.com/john202020/loose/blob/master/Readme-1.0.4.md).
check [readme-1.1.6.md](https://github.com/john202020/loose/blob/master/Readme-1.1.6.md).


### Knockout style listening
Retrieve Knockout reference and call listeners on it.

```javascript

var loose = require("loose")();

// retrieve the Knockout reference.
var koob = loose.ob;

//return //jquery event
//  {
//      values: //values if triggered by notify(values)
//      dom: //DOM document or DOM element
//  }

koob.listen("everyone else should be closed")
.subscribe(
    function(event){
        var values = event.values ; // values be {}
        var dom = event.dom; //the DOM document
    }
);
```

### Rxjs style listening
Retrieve Rxjs reference and call listeners on it.

```javascript

var loose = require("loose")();

// retrieve the Rxjs reference .
var rxob = loose.rx;

//return //jquery event
//  {
//      values: //values if triggered by notify(values)
//      dom: //DOM document or DOM element
//  }

rxob.listen("everyone else should be closed")
.subscribe(
    function(event){
        var values = event.values ; // values be {}
        var dom = event.dom; //the DOM document
    },
    function(err){}, //error
    function(){} //completed
);
```

```javascript
loose.notify("everyone else should be closed");
```

### API

__listen(jquery event, 'event name')__ 

``jquery event`` (start from version 1.1.7)

``values.event`` (removed starting from 1.1.7, check [readme-1.1.6.md](https://github.com/john202020/loose/blob/master/Readme-1.1.6.md))

```javascript
custom_call.subscribe(
    function(jqueryevent){
        var values = jqueryevent.values ;     
        var dom = jqueryevent.dom; //the DOM anchor element
    }
);
```

__notify(values, 'event name');__

``values`` optional. 

If ``values`` exists, it will first be json stringified and parse back when listened. 
If undefined, or null, will be turned to {}.

```javascript

notify({id:12}, 'just added a new person');
notify('call all to be alerted');

```


### Depedency
It depends on jquery (at least v.1.7) to emit and listen javascript event.
It depends on knockout.
It depends on Rxjs.
