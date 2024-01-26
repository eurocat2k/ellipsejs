/**
 * @name scale
 * @param {Array(2)} p point
 * @param {Number} scalar 
 * @returns {Array(2)} a scaled vector in 2D
 */
function scale(p, scalar) {
    return [ p[0] * scalar, p[1] * scalar ];
}
/**
 * @name add
 * @param {Array(2)} p1 point
 * @param {Array(2)} p2 point
 * @returns {Array(2)} addition of two vectors 2D
 */
function add(p1, p2) {
   return [ p1[0] + p2[0], p1[1] + p2[1] ];
}
/**
 * @name subtract
 * @param {Array(2)} p1 point
 * @param {Array(2)} p2 point
 * @returns {Array(2)} subtration of two vectors 2D
 */
function subtract(p1, p2) {
   return [ p1[0] - p2[0], p1[1] - p2[1] ];
}
/**
 * @name dot
 * @description returns a dot product of two vectors 2D
 * @param {Array(2)} p1 point
 * @param {Array(2)} p2 point
 * @returns {Number} a dot porduct
 */
function dot(p1, p2) {
   return p1[0] * p2[0] + p1[1] * p2[1];
}
/**
 * @name normalize
 * @param {Array(2)} p as a point
 * @returns {Array(2)} a normal vector
 */
function normalize(p) {
   return scale(p, 1 / magnitude(p));
}
/**
 * @name toPolar
 * @description converts 2D point coordinates to polar coordinates
 * @param {Array(2)} a point 
 * @returns {Object} direction and magnitude as numbers
 */
function toPolar([ x, y ]) {
   return { dir: direction([x, y]), mag: magnitude([x, y]) };
}
/**
 * @name toXY
 * @description converts polar coordinates to vector
 * @param {Number} mag length
 * @param {Number} dir direction angle
 * @returns {Array(2)} a new point
 */
function toXY( {mag, dir} ) {
   return [Math.cos(dir) * mag, Math.sin(dir) * mag]
}
/**
 * @name direction
 * @param {Array(2)} param0 a point
 * @returns {Number} direction angle in radians
 */
function direction([x, y]) {
   return Math.atan2(y, x);
}

/**
 * @name magnitude
 * @description returns vector magnitude
 * @param {Array(2)} param0 
 * @returns 
 */
function magnitude([x, y]) {
   return Math.hypot(x, y);
}

// Pythagorean Theorem Video
// https://youtu.be/iqSlzYXdFzw
/**
 * @name distance
 * @param {Array(2)} p1 point1
 * @param {Array(2)} p2 point 2
 * @returns distance between two points
 */
function distance(p1, p2) {
   return Math.hypot(p1[0] - p2[0], p1[1] - p2[1]);
}

// Linear Interpolation Video
// https://youtu.be/J_puRs40GhM
/**
 * @name lerp
 * @description calculates linear interpolation, value in range a and b at t
 * @param {Number} a 
 * @param {Number} b 
 * @param {Number} t 
 * @returns value in range between a and b at t
 */
function lerp(a, b, t) {
   return a + (b - a) * t;
}
/**
 * @name lerp2D
 * @description 
 * @param {Array(2)} A a point at A
 * @param {Array(2)} B a point at B
 * @param {Number} t coef
 * @returns Array(2) - a point on the vector AB at t
 */
function lerp2D(A, B, t) {
    return [lerp(A[0], B[0], t), lerp(A[1], B[1], t)]
}