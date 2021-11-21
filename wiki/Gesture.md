# Gesture Recognition

Gesture recognition is done by looking up coordinates of different detected landmarks  

Entire implementation is in `src/gesture.js` and can be further extended with additional rules  

There are three pre-defined methods:

- face(): implements:
  - "*facing `<left|center|right>`*": if depth of left and right face border matches
  - "*blink `<left|right>` eye*"
  - "*mouth `<percentage>` open*"  
  - "*head `<up|down>`*"  
- iris(): implements:
  - "*facing center*": if iris area sizes matches
  - "*looking <left|right>*": if iris center is far from eye outside corner
  - "*looking <up|down>*": if iris center is far from eye bottom eyelid
  - "*looking center*": if neither up/down and left/right
- body(): implements:
  - "*leaning `<left|right>`*"
  - "*raise `<left|right>` hand*"
  - "*i give up*"
- hand(): implements:
  - "*`<finger>` forward `<finger>` up*"

Example output of `result.gesture`:

```js
[
  {face: "0", gesture: "facing camera"}
  {face: "0", gesture: "head up"}
  {iris: "0", gesture: "looking center"}
  {body: "0", gesture: "i give up"}
  {body: "0", gesture: "leaning left"}
  {hand: "0", gesture: "thumb forward middlefinger up"}
]
```

Where number after gesture refers to number of person that detection belongs to in scenes with multiple people.
