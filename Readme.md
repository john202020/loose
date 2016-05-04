
### Inspired by Rxjs
``rxjs`` observable style listening (i.e. streaming, filtering, mapping, are available on listener). 

```
(the non observable and knockout observable style listening are removed.)
```
For non observable style listening, check [readme-1.0.4.md](https://github.com/john202020/loose/blob/master/Readme-1.0.4.md).

For observable style listening, check [readme-1.1.6.md](https://github.com/john202020/loose/blob/master/Readme-1.1.6.md).


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

var listener_of_click_on_all_achor = listen("click", "a");
var listener_of_a_custom_event = listen("some custom event name");

```

__subscribe(function(event){})__


```javascript

//event is the jquery event (since version 1.1.7)
//values.event (removed since 1.1.7)

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
