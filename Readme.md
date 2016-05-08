
### Inspired by Rxjs
``rxjs`` observable style listening (i.e. streaming, filtering, mapping, are available on listener). 

```
(the non observable and knockout observable style listening are removed.)
```

### Rxjs observable listening

```javascript

var loose = require("loose");
var lc_one = loose();

lc_one.listenOthers("close everyone else")
.subscribe(
        function(event){
            // do something     
        },
        function(err){}, //error
        function(){} //completed
    );

...

// in other web components, trigger notification to all listeners

var loose = require("loose");
var lc_another = loose();

lc_another.notify("close everyone else");

```

```javascript

// listen to click on label

var loose = require("loose");
var lc_one = loose();

lc_one.listen("click", "label")
.subscribe(
        function(event){
            var dom = event.dom;
            var id = $(dom).attr("id");
        },
        function(err){}, //error
        function(){} //completed
    );

```


### API

__listen(event name [, jquery style dom element selector])__ 

```javascript

//listen(custom or dom event name [, selector])
//listenSelf(custom event name) 
//listenOthers(custom event name) 
//listenDocument(custom or dom event name [, selector]) 
//listenElement(custom or dom event name [, selector]) 

var listen_anchor_click = listen("click", "a");
var listen_custom_event = listen("custom event");

```

__subscribe(function(event){})__


```javascript

somelistener.subscribe(
    function(event){
        var values = event.values; // {} if triggered by event from dom element
        var dom = event.dom; // either dom document or dom element
    }
);
```

__notify('event name' [, values])__


```javascript

//values is optional. (note: if values exists, it might be first be json stringified and parse back when listened) 
//If undefined, or null, will be turned to {}.

notify({id:12}, 'just added a new person');
notify('call all to be alerted');

```

__noConflict()__


```javascript

var loose = loose.noConflict();

```