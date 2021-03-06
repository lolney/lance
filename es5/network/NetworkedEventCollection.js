'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseTypes = require('../serialize/BaseTypes');

var _BaseTypes2 = _interopRequireDefault(_BaseTypes);

var _Serializable2 = require('../serialize/Serializable');

var _Serializable3 = _interopRequireDefault(_Serializable2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Defines a collection of NetworkEvents to be transmitted over the wire
 */
var NetworkedEventCollection = function (_Serializable) {
    _inherits(NetworkedEventCollection, _Serializable);

    _createClass(NetworkedEventCollection, null, [{
        key: 'netScheme',
        get: function get() {
            return {
                events: {
                    type: _BaseTypes2.default.TYPES.LIST,
                    itemType: _BaseTypes2.default.TYPES.CLASSINSTANCE
                }
            };
        }
    }, {
        key: 'name',
        get: function get() {
            return 'NetworkedEventCollection';
        }
    }]);

    function NetworkedEventCollection(events) {
        _classCallCheck(this, NetworkedEventCollection);

        var _this = _possibleConstructorReturn(this, (NetworkedEventCollection.__proto__ || Object.getPrototypeOf(NetworkedEventCollection)).call(this));

        _this.events = events || [];
        return _this;
    }

    return NetworkedEventCollection;
}(_Serializable3.default);

exports.default = NetworkedEventCollection;