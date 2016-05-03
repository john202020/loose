For non observable style listening, check [readme-1.0.4.md](https://github.com/john202020/loose/blob/master/Readme-1.0.4.md).

For observable style listening, check [readme-1.1.6.md](https://github.com/john202020/loose/blob/master/Readme-1.1.6.md).

### Inspired by Rxjs
We are happy to announce the __full rxjs observable__ style listening. 

Previous version 1.1.6, the observable style does not perform full knockout observable functionality.
This time we add the full rxjs observable into the listener return. Meaning that you can further use streaming, filtering, mapping on the returned observable.


```javascript

var lc = require("loose")();
var lc_rx = lc.rx;
```

### Rxjs observable listening
Retrieve Rxjs reference and call listeners on it.

```javascript

// retrieve the Rxjs reference
lc_rx.listen("everyone else should be closed")
        .subscribe(
            function(event){
                var values = event.values;
                var dom = event.dom;

                var id = $(dom).attr("id");
            },
            function(err){}, //error
            function(){} //completed
        );

lc_rx.listen("some other event")
        .filter(n=> some validation)
        .map(n=> some new value)
        .subscribe(
            function(some new value){
            },
            function(err){}, //error
            function(){} //completed
        );
```

```javascript
lc.notify("everyone else should be closed");
```

### API

__listen(jquery event, 'event name')__ 

``event`` (``event`` is the jquery event, start from version 1.1.7)

``values.event`` (removed starting from 1.1.7, check [readme-1.1.6.md](https://github.com/john202020/loose/blob/master/Readme-1.1.6.md))

```javascript
custom_call.subscribe(
    function(event){
        var values = event.values;
        var dom = event.dom; //the DOM anchor element
    }
);
```

__notify(values, 'event name');__

``values`` optional. (note: if ``values`` exists, it might be first be json stringified and parse back when listened) 
If undefined, or null, will be turned to {}.

```javascript

notify({id:12}, 'just added a new person');
notify('call all to be alerted');

```

### Depedency
It depends on jquery (at least v.1.7) to emit and listen javascript event.
It depends on knockout.
It depends on Rxjs.
