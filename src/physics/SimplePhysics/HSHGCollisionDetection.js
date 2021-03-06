import HSHG from './HSHG';

// Collision detection based on Hierarchical Spatial Hash Grid
// uses this implementation https://gist.github.com/kirbysayshi/1760774
export default class HSHGCollisionDetection {
    constructor(options) {
        this.options = Object.assign({ COLLISION_DISTANCE: 28 }, options);
    }

    init(options) {
        this.gameEngine = options.gameEngine;
        this.grid = new HSHG();
        this.previousCollisionPairs = {};
        this.stepCollidingPairs = {};
        this.objects = [];
        this.keyObjectDetection = options.keyObjectDetection;

        this.gameEngine.on('objectAdded', obj => {
            // add the gameEngine obj the the spatial grid
            this.grid.addObject(obj);
            if (obj.isKeyObject) {
                this.objects.push(obj);
            }
        });

        this.gameEngine.on('objectDestroyed', obj => {
            // add the gameEngine obj the the spatial grid
            this.grid.removeObject(obj);
            if (obj.isKeyObject) {
                this.objects.splice(this.objects.indexOf(obj), 1);
            }
        });
    }

    detect() {
        let possibleCollisions = this.keyObjectDetection ?
            this.grid.queryForCollisionPairsWithObjs(this.objects) :
            this.grid.queryForCollisionPairs();

        this.grid.update();
        this.stepCollidingPairs = possibleCollisions.reduce(
            (accumulator, currentValue, i) => {
                let pairId = getArrayPairId(currentValue);
                accumulator[pairId] = {
                    o1: currentValue[0],
                    o2: currentValue[1]
                };
                return accumulator;
            },
            {}
        );

        for (let pairId of Object.keys(this.previousCollisionPairs)) {
            let pairObj = this.previousCollisionPairs[pairId];

            // existed in previous pairs, but not during this step: this pair stopped colliding
            if (pairId in this.stepCollidingPairs === false) {
                this.gameEngine.emit('collisionStop', pairObj);
            }
        }

        let collisionObjects = [];
        for (let pairId of Object.keys(this.stepCollidingPairs)) {
            let pairObj = this.stepCollidingPairs[pairId];

            // didn't exist in previous pairs, but exists now: this is a new colliding pair
            if (pairId in this.previousCollisionPairs === false) {
                this.gameEngine.emit('collisionStart', pairObj);
                collisionObjects.push(pairObj);
            }
        }

        this.previousCollisionPairs = this.stepCollidingPairs;
        return collisionObjects;
    }

    /**
     * checks wheter two objects are currently colliding
     * @param o1 {Object} first object
     * @param o2 {Object} second object
     * @returns {boolean} are the two objects colliding?
     */
    areObjectsColliding(o1, o2) {
        return getArrayPairId([o1, o2]) in this.stepCollidingPairs;
    }
}

function getArrayPairId(arrayPair) {
    // make sure to get the same id regardless of object order
    let sortedArrayPair = arrayPair.slice(0).sort();
    return sortedArrayPair[0].id + '-' + sortedArrayPair[1].id;
}

module.exports = HSHGCollisionDetection;
