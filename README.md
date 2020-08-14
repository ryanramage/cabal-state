cabal-state
============

Run a state machine inside a [cabal-core](https://github.com/cabal-club/cabal-core).


usage
-----

```
const Cabal = require('cabal-core')
const CabalState = require('cabal-state')
const RAM = require('random-access-memory')
const machineDfn = require('cabal-state-example-button')
const key = '0201400f1fa2e3076a3f17f4521b2cc41e258c446cdaa44742afe6e1b9fd5f82'
const cabal = Cabal(RAM, key)
const service = CabalState.fromJson(cabal, machineDfn, 'default')
service.onTransition(state => {
  console.log(state.value);
  console.log(state.context)
});
cabal.swarm(() => {})
```
