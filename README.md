# How to

Use following to get started

```
npm start
```

# Tech debt so far

It seems that state pattern doesn't fit too well or is wrongly implemented - requires further research.

Parts of the system seem to be over interdependant

1. ворота не закрываются по таймеру (пауза + полностью открыто), если есть машина
2. ворота не закрываюся по нажатию, если есть машина
3. воротка начинаются октрываться, если закрывались, и появилась машина
