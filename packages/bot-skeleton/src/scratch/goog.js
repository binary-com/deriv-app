const goog = {};

goog.inherits = function (childCtor, parentCtor) {
    function tempCtor() {}
    tempCtor.prototype = parentCtor.prototype;
    childCtor.superClass_ = parentCtor.prototype;
    // eslint-disable-next-line new-cap
    childCtor.prototype = new tempCtor();
    childCtor.prototype.constructor = childCtor;

    childCtor.base = function (me, methodName, ...args) {
        return parentCtor.prototype[methodName].apply(me, args);
    };
};

goog.math = {};

goog.isDef = function (e) {
    return e !== undefined;
};

goog.math.Size = function (e, t) {
    this.width = e;
    this.height = t;
};

goog.isNumber = function (e) {
    return /^\s*-?\d+(\.\d+)?\s*$/.test(e);
};

goog.dom = {};

goog.dom.removeNode = function (node) {
    if (node && node.parentNode) {
        node.parentNode.removeChild(node);
    }
};

goog.math.Coordinate = function (e, t) {
    this.x = goog.isDef(e) ? e : 0;
    this.y = goog.isDef(t) ? t : 0;
};

goog.math.Coordinate.prototype.scale = function (e, t) {
    // eslint-disable-next-line no-param-reassign
    t = goog.isNumber(t) ? t : e;
    this.x *= e;
    this.y *= t;
    return this;
};

goog.math.Coordinate.difference = function (coord1, coord2) {
    return new goog.math.Coordinate(coord1.x - coord2.x, coord1.y - coord2.y);
};

export default goog;
