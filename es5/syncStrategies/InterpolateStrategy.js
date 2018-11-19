'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

<<<<<<< HEAD
var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

=======
>>>>>>> ad9ce43d51e5013d08df140beed6928ac4d2648a
var _SyncStrategy2 = require('./SyncStrategy');

var _SyncStrategy3 = _interopRequireDefault(_SyncStrategy2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaults = {
<<<<<<< HEAD
    syncsBufferLength: 6,
    clientStepHold: 6,
=======
    clientStepHold: 6,
    localObjBending: 1.0, // amount of bending towards position of sync object
    remoteObjBending: 1.0, // amount of bending towards position of sync object
    bendingIncrements: 6, // the bending should be applied increments (how many steps for entire bend)
>>>>>>> ad9ce43d51e5013d08df140beed6928ac4d2648a
    reflect: false
};

var InterpolateStrategy = function (_SyncStrategy) {
    _inherits(InterpolateStrategy, _SyncStrategy);

    function InterpolateStrategy(clientEngine, inputOptions) {
        _classCallCheck(this, InterpolateStrategy);

        var options = Object.assign({}, defaults, inputOptions);

        var _this = _possibleConstructorReturn(this, (InterpolateStrategy.__proto__ || Object.getPrototypeOf(InterpolateStrategy)).call(this, clientEngine, options));

<<<<<<< HEAD
        _this.syncsBuffer = []; // buffer for server world updates
        _this.gameEngine = _this.clientEngine.gameEngine;
        _this.gameEngine.passive = true; // client side engine ignores inputs
        _this.gameEngine.on('client__postStep', _this.interpolate.bind(_this));
        return _this;
    }

    _createClass(InterpolateStrategy, [{
        key: 'collectSync',
        value: function collectSync(e) {

            _get(InterpolateStrategy.prototype.__proto__ || Object.getPrototypeOf(InterpolateStrategy.prototype), 'collectSync', this).call(this, e);

            if (!this.lastSync) return;

            this.syncsBuffer.push(this.lastSync);
            if (this.syncsBuffer.length >= this.options.syncsBufferLength) {
                this.syncsBuffer.shift();
            }
        }

        // add an object to our world

    }, {
        key: 'addNewObject',
        value: function addNewObject(objId, newObj, stepCount) {

            var curObj = new newObj.constructor(this.gameEngine, {
                id: objId
            });
            curObj.syncTo(newObj);
            curObj.passive = true;
            this.gameEngine.addObjectToWorld(curObj);
            console.log('adding new object ' + curObj);

            if (stepCount) {
                curObj.lastUpdateStep = stepCount;
            }

            return curObj;
        }

        /**
         * Perform client-side interpolation.
         */

    }, {
        key: 'interpolate',
        value: function interpolate() {
            var _this2 = this;

            // get the step we will perform
            var world = this.gameEngine.world;
            var stepToPlay = world.stepCount - this.options.clientStepHold;
            var nextSync = null;

            // get the closest sync to our next step
            for (var x = 0; x < this.syncsBuffer.length; x++) {
                if (this.syncsBuffer[x].stepCount >= stepToPlay) {
                    nextSync = this.syncsBuffer[x];
                    break;
                }
            }

            // we requires a sync before we proceed
            if (!nextSync) {
                this.gameEngine.trace.debug(function () {
                    return 'interpolate lacks future sync - requesting step skip';
                });
                this.clientEngine.skipOneStep = true;
                return;
            }

            this.gameEngine.trace.debug(function () {
                return 'interpolate past step [' + stepToPlay + '] using sync from step ' + nextSync.stepCount;
            });

            // create objects which are created at this step
            var stepEvents = nextSync.syncSteps[stepToPlay];
            if (stepEvents && stepEvents.objectCreate) {
                stepEvents.objectCreate.forEach(function (ev) {
                    _this2.addNewObject(ev.objectInstance.id, ev.objectInstance, stepToPlay);
                });
            }

            // create objects for events that imply a create-object
            if (stepEvents && stepEvents.objectUpdate) {
                stepEvents.objectUpdate.forEach(function (ev) {
                    if (!world.objects[ev.objectInstance.id]) _this2.addNewObject(ev.objectInstance.id, ev.objectInstance, stepToPlay);
                });
            }

            // remove objects which are removed at this step
            if (stepEvents && stepEvents.objectDestroy) {
                stepEvents.objectDestroy.forEach(function (ev) {
                    if (world.objects[ev.objectInstance.id]) _this2.gameEngine.removeObjectFromWorld(ev.objectInstance.id);
                });
            }

            // interpolate values for all objects in this world
            world.forEachObject(function (id, ob) {

                var nextObj = null;
                var nextStep = null;

                // if we already handled this object, continue
                // TODO maybe call it lastUpdatedStep
                if (ob.lastUpdateStep === stepToPlay) return;

                // get the nearest object we can interpolate to
                if (!nextSync.syncObjects.hasOwnProperty(id)) return;

                nextSync.syncObjects[id].forEach(function (ev) {
                    if (!nextObj && ev.stepCount >= stepToPlay) {
                        nextObj = ev.objectInstance;
                        nextStep = ev.stepCount;
                    }
                });

                if (nextObj) {
                    var playPercentage = 1 / (nextStep + 1 - stepToPlay);
                    if (_this2.options.reflect) playPercentage = 1.0;
                    _this2.interpolateOneObject(ob, nextObj, id, playPercentage);
                }
            });

            // destroy objects
            world.forEachObject(function (id, ob) {
                var objEvents = nextSync.syncObjects[id];
                if (!objEvents || Number(id) >= _this2.gameEngine.options.clientIDSpace) return;

                objEvents.forEach(function (e) {
                    if (e.eventName === 'objectDestroy') _this2.gameEngine.removeObjectFromWorld(id);
                });
            });
        }

        // TODO: prevObj is now just curObj
        //       and playPercentage is 1/(nextObj.step - now)
        //       so the code below should be easy to simplify now

    }, {
        key: 'interpolateOneObject',
        value: function interpolateOneObject(prevObj, nextObj, objId, playPercentage) {

            // update position and orientation with interpolation
            var curObj = this.gameEngine.world.objects[objId];
            if (typeof curObj.interpolate === 'function') {
                this.gameEngine.trace.trace(function () {
                    return 'object ' + objId + ' before ' + playPercentage + ' interpolate: ' + curObj.toString();
                });
                curObj.interpolate(nextObj, playPercentage, this.gameEngine.worldSettings);
                this.gameEngine.trace.trace(function () {
                    return 'object ' + objId + ' after interpolate: ' + curObj.toString();
                });
            }
=======
        _this.gameEngine.ignoreInputs = true; // client side engine ignores inputs
        _this.gameEngine.ignorePhysics = true; // client side engine ignores physics
        _this.STEP_DRIFT_THRESHOLDS = {
            onServerSync: { MAX_LEAD: -8, MAX_LAG: 16 }, // max step lead/lag allowed after every server sync
            onEveryStep: { MAX_LEAD: -4, MAX_LAG: 24 }, // max step lead/lag allowed at every step
            clientReset: 40 // if we are behind this many steps, just reset the step counter
        };
        return _this;
    }

    // apply a new sync


    _createClass(InterpolateStrategy, [{
        key: 'applySync',
        value: function applySync(sync, required) {
            var _this2 = this;

            // if sync is in the past we cannot interpolate to it
            if (!required && sync.stepCount <= this.gameEngine.world.stepCount) {
                return this.SYNC_APPLIED;
            }

            this.gameEngine.trace.debug(function () {
                return 'interpolate applying sync';
            });
            //
            //    scan all the objects in the sync
            //
            // 1. if the object exists locally, sync to the server object
            // 2. if the object is new, just create it
            //
            this.needFirstSync = false;
            var world = this.gameEngine.world;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                var _loop = function _loop() {
                    var ids = _step.value;


                    // TODO: we are currently taking only the first event out of
                    // the events that may have arrived for this object
                    var ev = sync.syncObjects[ids][0];
                    var curObj = world.objects[ev.objectInstance.id];

                    if (curObj) {

                        // case 1: this object already exists locally
                        _this2.gameEngine.trace.trace(function () {
                            return 'object before syncTo: ' + curObj.toString();
                        });
                        curObj.saveState();
                        curObj.syncTo(ev.objectInstance);
                        _this2.gameEngine.trace.trace(function () {
                            return 'object after syncTo: ' + curObj.toString() + ' synced to step[' + ev.stepCount + ']';
                        });
                    } else {

                        // case 2: object does not exist.  create it now
                        _this2.addNewObject(ev.objectInstance.id, ev.objectInstance);
                    }
                };

                for (var _iterator = Object.keys(sync.syncObjects)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    _loop();
                }

                //
                // bend back to original state
                //
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                var _loop2 = function _loop2() {
                    var objId = _step2.value;


                    var obj = world.objects[objId];
                    var isLocal = obj.playerId == _this2.gameEngine.playerId; // eslint-disable-line eqeqeq
                    var bending = isLocal ? _this2.options.localObjBending : _this2.options.remoteObjBending;
                    obj.bendToCurrentState(bending, _this2.gameEngine.worldSettings, isLocal, _this2.options.bendingIncrements);
                    if (typeof obj.refreshRenderObject === 'function') obj.refreshRenderObject();
                    _this2.gameEngine.trace.trace(function () {
                        return 'object[' + objId + '] ' + obj.bendingToString();
                    });
                };

                for (var _iterator2 = Object.keys(world.objects)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    _loop2();
                }

                // destroy objects
                // TODO: use world.forEachObject((id, ob) => {});
                // TODO: identical code is in InterpolateStrategy
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                var _loop3 = function _loop3() {
                    var objId = _step3.value;


                    var objEvents = sync.syncObjects[objId];

                    // if this was a full sync, and we did not get a corresponding object,
                    // remove the local object
                    if (sync.fullUpdate && !objEvents && objId < _this2.gameEngine.options.clientIDSpace) {
                        _this2.gameEngine.removeObjectFromWorld(objId);
                        return 'continue';
                    }

                    if (!objEvents || objId >= _this2.gameEngine.options.clientIDSpace) return 'continue';

                    // if we got an objectDestroy event, destroy the object
                    objEvents.forEach(function (e) {
                        if (e.eventName === 'objectDestroy') _this2.gameEngine.removeObjectFromWorld(objId);
                    });
                };

                for (var _iterator3 = Object.keys(world.objects)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var _ret3 = _loop3();

                    if (_ret3 === 'continue') continue;
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            return this.SYNC_APPLIED;
>>>>>>> ad9ce43d51e5013d08df140beed6928ac4d2648a
        }
    }]);

    return InterpolateStrategy;
}(_SyncStrategy3.default);

exports.default = InterpolateStrategy;