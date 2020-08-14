cabal-state
============

Run a state machine inside a [cabal-core](https://github.com/cabal-club/cabal-core) channel

Status: Experimental

motivation
----------

I wanted to create something less formal than a smart contract, but still does a shared vm and could be auditable.

Use cases could include:

 - small group workflows. Lets take on docusign, voting, etc
 - jackbox style p2p games with no host server. The shared game state runs over the cabal channel.
 - more ideas to come...

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

API
---

    const service = CabalState.fromJson(cabal, machineDfn, channel)

Create a running service, which is an instance of [XState interpreter](https://xstate.js.org/docs/guides/interpretation.html#interpreter)

 - ```cabal``` is a [cabal-core](https://github.com/cabal-club/cabal-core) p2p database
 - ```machineDfn``` json file that defines the state machine. It will run in a VM sandbox. See [Creating the machineDfn](#creating-the-machinedfn)
 - ```channel``` channel name the state machine will listen for events to transition its current state.


Sandbox
-------

Xstate allows for functions to execute as gaurd conditions, to compute state, and to have some side effects. Currently, we run all code
in a [vm2](https://github.com/patriksimek/vm2) sandbox, and only allow access to the console.

Its very important in a distributed environment that the state machine is side effect free. For example, adding fetch to the sandbox would cause many issues. 


Creating The MachineDfn
------------------------

The machine is defined in json, so it is portable. We have tools that help a developer write the machine in js and then build the json from that. The js is practically an [Xstate machine](https://xstate.js.org/docs/guides/machines.html) with some limitations.

A machine is best published to npm (but does not have to be). This gives it a reasonable place to be versioned, publicly auditable, and easy to share. It the future we may build alternate repos for them. An example machine is the [Example Button](https://github.com/ryanramage/cabal-state-example-button) which will be reference below.

 1. Create a folder for the machine
 2. Create a xstate [index.js](https://github.com/ryanramage/cabal-state-example-button/blob/master/index.js) machine. It is mostly xstate format, with the exception that all actions, assignments, and guards are reference by strings, and the function are objects with keys that match.
 3. Run ```cabal-state index.js```. This converts the js to a portable json format in the ```index.json``` file.
 4. create a [package.json](https://github.com/ryanramage/cabal-state-example-button/blob/master/package.json) file that exports the index.json file, eg ```"main": "index.json",```
 5. publish to npm
