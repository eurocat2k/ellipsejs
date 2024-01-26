const offset = [0, 0]
const cursor = [0,0]
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

const context = {
    showCursor: false,
    initial: true,
    points: [
        [[0, 0], 1,'O','N', 14, '#FFF6C5'],
        [[220, 40], 5, 'A', 14, 'NE', 'gold'],
        [[160, -120], 5, `B`, 14, 'SE', 'paleturquoise'],
        [[-110, -170], 5, 'C', 14, 'SW', 'yellowgreen'],
        [[-190, 110], 5, 'D', 14, 'NW', 'orchid']
    ],
    csegment: {
        complete: 0,    // complte = 1, drop starting point and draw line between mouse coordinates, and starting point, complete = 2, drop the ending point at clicked position and draw segment betwwen them
        seg: [[0,0], [0,0], 3, [3, 4], '#00FFAA']
    },
    ellipse: {
        complete: 0,
        ffc: [[0,0], [0,0,], [0,0], 2, [], '#ECF000']
    }
}


// act on load and resize events
window.onload = (event) => {
    init()
    update()
}

window.onresize = (event) => {
    init()
    update()
}

window.oncontextmenu = (ev) => {
    context.showCursor = context.showCursor ? false : true
    context.csegment.complete = 0       // remove dynamic segment
    ev.preventDefault()
}

window.onclick = (ev) => {
    console.log(ev)
    if (ev.shiftKey) {
        // draw or set  first key = if complete value is greater than 1, reassign first point to the new point
        if (context.csegment.complete == 0) {
            let [mx, my] = [ev.clientX - offset[0], ev.clientY - offset[1]]
            my = -my
            context.csegment.seg[0] = [mx, my]
            context.csegment.complete = 1
        } else if (context.csegment.complete == 1) {
            let [mx, my] = [ev.clientX - offset[0], ev.clientY - offset[1]]
            my = -my
            context.csegment.seg[1] = [mx, my]
            context.csegment.complete = 2
        } else if (context.csegment.complete == 2) {
            // swap coordinates
            let [mx, my] = [ev.clientX - offset[0], ev.clientY - offset[1]]
            my = -my
            context.csegment.seg[0] = [mx, my]
            context.csegment.complete = 1
        }
    } else if (ev.ctrlKey) {
        // console.log(`Ellipse drawing....`)
        if (context.ellipse.complete === 0) {
            context.ellipse.complete = 1
            // drop first focus point: F1
            let [mx, my] = [ev.clientX - offset[0], ev.clientY - offset[1]]
            my = -my
            context.ellipse.ffc[0] = [mx, my]
        } else if (context.ellipse.complete === 1) {
            context.ellipse.complete = 2
            // drop first focus point: F1
            let [mx, my] = [ev.clientX - offset[0], ev.clientY - offset[1]]
            my = -my
            context.ellipse.ffc[1] = [mx, my]
        } else if (context.ellipse.complete === 2) {
            context.ellipse.complete = 3
            // drop first focus point: F1
            let [mx, my] = [ev.clientX - offset[0], ev.clientY - offset[1]]
            my = -my
            context.ellipse.ffc[2] = [mx, my]
        } else if (context.ellipse.complete === 3) {
            context.ellipse.complete = 1
            // drop first focus point: F1
            let [mx, my] = [ev.clientX - offset[0], ev.clientY - offset[1]]
            my = -my
            context.ellipse.ffc[0] = [mx, my]
        }
    }
    requestAnimationFrame(update)
}

window.onmousemove = (ev) => {
    cursor[0] = ev.clientX - offset[0]
    cursor[1] = ev.clientY - offset[1]
    cursor[1] = -cursor[1]
    // 
    requestAnimationFrame(update)
}

// init
function init() {
    canvas.width = document.body.offsetWidth
    canvas.height = document.body.offsetHeight
    offset[0] = (canvas.width * .5) + .5 >> 0
    offset[1] = (canvas.height * .5) + .5 >> 0
    ctx.translate(offset[0], offset[1])
    if (context.initial === true) {
        // set up point labels
        context.points = context.points.map(p => {
            let [pos, radius, label, fontsize, orientation, color] = [...p]
            p[2] = `${label} = [ ${pos.toString().replace(/,/g, ', ')} ]`
            return p
        })
        context.initial = false
    }
}

// clear
function clear() {
    // re-translate canvas to the origin (top left corner)
    ctx.save()
    if (offset[0] !== 0 && offset[1] !== 0) {
        ctx.translate(-offset[0], -offset[1])
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.restore()
}

// update
function update() {
    clear()
    // draw coord system
    drawCoordSystem()
    // draw the theme....
    if (context.showCursor === true) {
        drawDot(cursor, 2, `[ ${cursor} ]`, 12, 'S', "#ddd")
    }
    // draw segment between mouse selected coordinates
    if (context.csegment.complete >= 1) {
        let color = '#C3D400'
        let lineWidth = 1
        let lineDash = [5, 4]
        if (context.csegment.complete == 1) {
            // draw the segment between mousepos and firstly selected point
            drawSegment(context.csegment.seg[0], cursor, lineWidth, lineDash, color)
        } else {
            drawSegment(context.csegment.seg[0], context.csegment.seg[1], lineWidth, lineDash, color)
        }
    }

    // for draw ellipse with only two points
    // if (context.ellipse.complete > 0) {
    //     if (context.ellipse.complete === 1) {
    //         drawDot(context.ellipse.ffc[0], 5, 'F0', 12, 'NE', context.ellipse.ffc[5])
    //         // context.ellipse.complete = 2
    //     } else if (context.ellipse.complete === 2) {
    //         drawEllipse(context.ellipse.ffc[0], context.ellipse.ffc[1], magnitude(subtract(context.ellipse.ffc[1], context.ellipse.ffc[0])) * .25, 1, "orange")
    //         drawDot(context.ellipse.ffc[0], 5, 'F0', 12, 'NE', context.ellipse.ffc[5])
    //         drawDot(context.ellipse.ffc[1], 5, 'F0', 12, 'NE', context.ellipse.ffc[5])
    //         // context.ellipse.complete = 1
    //     }
    // }

    if (context.ellipse.complete > 0) {
        if (context.ellipse.complete === 1) {
            drawDot(context.ellipse.ffc[0], 5, 'F0', 12, 'NE', context.ellipse.ffc[5])
            // context.ellipse.complete = 2
        } else if (context.ellipse.complete === 2) {
            // drawEllipse3(context.ellipse.ffc[0], context.ellipse.ffc[1], context.ellipse.ffc[2]), 1, "orange")
            drawDot(context.ellipse.ffc[0], 5, 'F0', 12, 'NE', context.ellipse.ffc[5])
            drawDot(context.ellipse.ffc[1], 5, 'F1', 12, 'NE', context.ellipse.ffc[5])
            // drawDot(context.ellipse.ffc[0], 5, 'F0', 12, 'NE', context.ellipse.ffc[5])
            // context.ellipse.ffc[0] = context.ellipse.ffc[1]
            // context.ellipse.ffc[0] = context.ellipse.ffc[1]
            // context.ellipse.complete = 3
        } else if (context.ellipse.complete === 3) {
            // draw ellipse focus segments
            drawSegment(context.ellipse.ffc[0], context.ellipse.ffc[1], 2, [], '#C643FA')
            // draw dot at the center of the segment above
            let ellpsCenter = lerp2D(context.ellipse.ffc[0], context.ellipse.ffc[1], .5)
            // draw a segment between ellipse center and control point
            drawSegment(context.ellipse.ffc[2], ellpsCenter, 2, [], '#C643FA')
            let { dir, mag } = toPolar(subtract(context.ellipse.ffc[2], ellpsCenter))
            console.log({ dir, mag })
            // draw ellipse
            let ec = lerp2D(context.ellipse.ffc[0], context.ellipse.ffc[1], .5)
            let k = distance(context.ellipse.ffc[2], ec)
            // drawEllipse(context.ellipse.ffc[0], context.ellipse.ffc[1], context.ellipse.ffc[2], 1, "orange")
            // drawEllipse3(context.ellipse.ffc[0], context.ellipse.ffc[1], context.ellipse.ffc[2], 1, "orange")
            // draw dots
            drawDot(ellpsCenter, 5, 'cEllips', 12, 'S', context.ellipse.ffc[5])
            drawDot(context.ellipse.ffc[0], 5, 'F0', 12, 'NE', context.ellipse.ffc[5])
            drawDot(context.ellipse.ffc[1], 5, 'F1', 12, 'NE', context.ellipse.ffc[5])
            drawDot(context.ellipse.ffc[2], 5, 'CTRL', 12, 'NE', context.ellipse.ffc[5])
        }
    }

    // DRAW SEGMENT
    drawSegment(context.points[1][0], context.points[3][0], 2, [], 'rgb(218,203,0)')
    drawSegment(context.points[2][0], context.points[4][0], 2, [], 'rgb(8,197,211)')
    // 

    // DRAW POINTS    
    context.points.forEach(p => {
        drawDot(...p)
    })
    
}

// draw coordinate system
function drawCoordSystem() {
    ctx.save()
    ctx.strokeStyle = "rgb(255 246 197)"
    ctx.lineWidth = 1
    ctx.setLineDash([5, 3])
    ctx.beginPath()
    ctx.moveTo(-offset[0], 0)
    ctx.lineTo(offset[0], 0)
    ctx.moveTo(0, -offset[0])
    ctx.lineTo(0, offset[1])
    ctx.stroke()
    // 
    ctx.restore()
}

/**
 * ELLIPSE DRAWING HAVING MAJOR AXIS COORDINATES AND THE LENGTH OF THE MINOR SEMI AXIS - DISTANCE FROM THE CENTER OF THE ELLIPSE
 *               
 *                 ___
 *                  |
 *                  | minor semi axis = length is a scalar
 *                  |
 *  A---------------C---------------B
 *                  |
 *                  |
 *                  |
 *                  -
 */
/**
 * @name drawEllipse
 * @param {Array(2)} A string point of major axis
 * @param {Array(2)} B ending point of major axis
 * @param {Number} minor_semi_axis minor semi axis see abowe
 * @param {Number} linewidth
 * @param {String} color
 */
function drawEllipse3(A, B, C, lw, col) {
    let eCenter = lerp2D(A, B, .5)
    let a = subtract(B, eCenter)
    let ad = Math.abs(distance(B, eCenter))
    let minor_semi_axis = Math.abs(distance(C, eCenter)) * Math.cos(1 + toPolar(subtract(C, eCenter)).dir)
    let b = [a[1] * (Math.abs(minor_semi_axis) / Math.abs(ad)), -a[0] * (Math.abs(minor_semi_axis) / Math.abs(ad))]
    let step = Math.PI / 100.
    lw = !!lw && !isNaN(lw) ? lw : 1
    col = !!col && typeof col === 'string' ? col : '#000000'
    ctx.save()
    ctx.lineWidth = lw
    ctx.strokeStyle = col
    for (let ang = toPolar(subtract(C, eCenter)).dir, s = 0; s <= 2. * Math.PI; ang += step, s += step) {
        let x = eCenter[0] + a[0] * Math.cos(ang) + b[0] * Math.sin(ang)
        let y = eCenter[1] + a[1] * Math.cos(ang) + b[1] * Math.sin(ang)
        if (s === 0) {
            console.log({A, B, a, b, ad, minor_semi_axis, ang})
            ctx.moveTo(x, -y)
        } else {
            ctx.lineTo(x, -y)
        }
    }
    ctx.stroke()
    ctx.restore()
}

function drawEllipse(A, B, minor_semi_axis, lw, col) {
    let eCenter = lerp2D(A, B, .5)
    let a = subtract(B, eCenter)
    let ad = distance(B, eCenter)
    // let b = scale(a, Math.abs(minor_semi_axis) / Math.abs(ad))
    let b = [a[1] * (Math.abs(minor_semi_axis) / Math.abs(ad)), -a[0] * (Math.abs(minor_semi_axis) / Math.abs(ad))]
    let step = Math.PI / 100.
    lw = !!lw && !isNaN(lw) ? lw : 1
    col = !!col && typeof col === 'string' ? col : '#000000'
    // console.log({A, B, a, b, ad, minor_semi_axis})
    ctx.save()
    ctx.lineWidth = lw
    ctx.strokeStyle = col
    for (let ang = 0; ang <= 2. * Math.PI; ang += step) {
        let x = eCenter[0] + a[0] * Math.cos(ang) + b[0] * Math.sin(ang)
        let y = eCenter[1] + a[1] * Math.cos(ang) + b[1] * Math.sin(ang)
        if (ang === 0) {
            ctx.moveTo(x, -y)
        } else {
            ctx.lineTo(x, -y)
        }
    }
    ctx.stroke()
    ctx.restore()
}

/**
 * @name drawEllipse
 * @param {Array(2)} foci1
 * @param {Array(2)} foci2
 * @param {Number} majorAxis
 * @param {Number} linewidth
 * @param {String} color
 */
function drawEllipse1(foci1, foci2, k, w, c) {
    let alen = arguments.length
    try {
        
        if (alen < 3) throw new Error(`drawEllipse() expects minimum 3 arguments <f0, f1, A>, it got alen`)
        let [f0, f1, k, lw, col] = [...arguments]
        f0 = f0 instanceof Array ? f0 : [0, 0]
        f1 = f1 instanceof Array ? f1 : [0, 0]
        let d = distance(f1, f0)
        console.log({k, d}, ...arguments)
        k = !isNaN(k) ? k : 0
        lw = !!lw && !isNaN(lw) ? lw : 0
        col = !!col && typeof col === 'string' ? col : '#000000'
        
        
        if (k > Number.EPSILON && d > Number.EPSILON) {
            console.log(`drawEllipse called`, k, d)
            let step = Math.PI / 100.0
            let a = k * .5
            let eCenter = lerp2D(f0, f1, .5)
            let dc = distance(f1, f0) * .5
            let b = Math.sqrt(Math.abs((a * a) - (dc * dc)))
            let phi = toPolar(subtract(f1, f0)).dir
            phi += Math.PI * .5
            let savPos0
            ctx.save()
            ctx.lineWidth = lw
            ctx.strokeStyle = col
            console.log({a, b, dc, phi}, Math.sqrt(Math.abs((a * a) - (dc * dc))))
            for (let t = 0; t < 2 * Math.PI; t += step) {
                let xt = eCenter[0] + a * Math.cos(t) * Math.cos(phi) - b * Math.sin(t) * Math.sin(phi)
                let yt = eCenter[1] + a * Math.cos(t) * Math.sin(phi) + b * Math.sin(t) * Math.cos(phi)
                if (t === 0) {
                    ctx.moveTo(xt, -yt)
                    savPos0 = [xt, -yt]
                    console.log({ xt, yt: -yt })
                } else {
                    ctx.lineTo(xt, -yt)
                }
            }
            ctx.lineTo(...savPos0)
            ctx.stroke()
            ctx.restore()
        }
    } catch (error) {
        console.error(error.message)
    }
}

/**
 * @name drawSegment
 * @description draws line segment between two points with a color and line width
 * @param {Array(2)} p0 the first point of the linesegment: default [0,0]
 * @param {Array(2)} p1 the second point of the linesegment: default [0,0]
 * @param {Number} lineWidth  the line with in pixels: default 1
 * @param {Array(2)} lineDash array for the line dash style
 * @param {String} color the color of the line segment
 */
function drawSegment() {
    let alen = arguments.length
    try {
        if (alen !== 5) throw new Error(`drawSegment() expects 5 arguments, it got ${alen}`)
        let [p0, p1, lw, ld, col] = [...arguments]    
        p0 = p0 instanceof Array ? p0.slice(0, 2) : [0, 0]
        p1 = p1 instanceof Array ? p1.slice(0, 2) : [0, 0]
        p0 = p0.map((e, i) => {
            if (!isNaN(e)) {
                if (i == 1) {
                    return -e
                } else {
                    return e
                }
            } else {
                return 0
            }
        })
        p1 = p1.map((e, i) => {
            if (!isNaN(e)) {
                if (i == 1) {
                    return -e
                } else {
                    return e
                }
            } else {
                return 0
            }
        })
        // console.log([p0, p1, lw, ld, col])
        // distance between p0 and p1
        let d = distance(p1, p0)
        if (d > Number.EPSILON) {
            // ok, we can draw the segment
            lw = !isNaN(lw) ? parseInt(lw) : 1
            col = typeof col === 'string' ? col : 'white'
            // draw line segment
            ctx.save()
            ctx.setLineDash(ld instanceof Array ? ld : [])
            ctx.strokeStyle = col
            ctx.lineWidth = lw
            ctx.beginPath()
            ctx.moveTo(p0[0], p0[1])
            ctx.lineTo(p1[0], p1[1])
            ctx.stroke()
            ctx.restore()
        }
    } catch (error) {
        console.error(error.message)
    }
    
}

// converts y coordinates to chartesian orientation: north up, south down, swapping sign
/**
 * @name drawDot
 * @description draws a labelled point on the canvas - label coordinates if present in the label text - will use swapped Y coordinates
 *              to match the Chartesian coordinate systems other than default canvas coordinate systems (x from left to right, y from top to bottom)
 * @param {Array[2|3]} pos the position of the point: default [0,0]
 * @param {Number} radius the radius of the point circle: default 0
 * @param {String} label label text: default ''
 * @param {Number} fontSize the size of the label text: default 10
 * @param {String} orientation the relative position of the label text from the point coordinates: 'N'|<'NE'>|'E'|'SE'|'S'|'SW'|'W'|'NW'
 * @param {String} color the color of the point and the label: default 'white'
 */
function drawDot() {
    try {
        let alen = arguments.length
        if (alen !== 6) {
            throw new Error(`drawDot expects 5 arguments: [Array(2)]:position, Number:radius, String:label, String:orientation, String:color got only ${alen}`)
        }
        let [pos, radius, label, fontSize, orientation, color] = [...arguments]
        pos = pos instanceof Array ? pos.slice(0, 2) : [0, 0]
        pos = pos.map((e, i) => {
            if (!isNaN(e)) {
                if (i == 1) {
                    return -e
                } else {
                    return e
                }
            } else {
                return 0
            }
        })
        radius = !isNaN(radius) ? radius : 0
        orientation = typeof orientation === 'string' ? orientation : 'NE'
        color = typeof color === 'string' ? color : 'white'
        // console.log({ pos, radius, label, fontSize, orientation, color })
        fontSize = !isNaN(fontSize) ? parseInt(fontSize) : 10
        // draw dot first 
        ctx.save()
        if (radius) {
            ctx.fillStyle = color
            ctx.beginPath()
            ctx.arc(pos[0], pos[1], radius, 0, 2 * Math.PI)
            // put label relative to the point
            ctx.textAlign = 'center'
            if (orientation.match(/^ne$/i)) {
                // console.log(`NE`)
                ctx.textAlign = 'left'
                ctx.font = `bold ${fontSize}px helvetica`
                ctx.fillText(label, pos[0] + Math.round(.75 * fontSize), pos[1] - Math.round(.75 * fontSize))
            } else if (orientation.match(/^se$/i)) {
                // console.log(`SE`)
                ctx.textAlign = 'left'
                ctx.font = `bold ${fontSize}px helvetica`
                ctx.fillText(label, pos[0] + Math.round(.75 * fontSize), pos[1] + Math.round(1.25 * fontSize))
            } else if (orientation.match(/^sw$/i)) {
                ctx.textAlign = 'right'
                ctx.font = `bold ${fontSize}px helvetica`
                ctx.fillText(label, pos[0] - Math.round(.75 * fontSize), pos[1] + Math.round(1.25 * fontSize))
            } else if (orientation.match(/^nw$/i)) {
                ctx.textAlign = 'right'
                ctx.font = `bold ${fontSize}px helvetica`
                ctx.fillText(label, pos[0] - Math.round(.75 * fontSize), pos[1] - Math.round(.75 * fontSize))
            } else if (orientation.match(/^n$/i)) {
                ctx.textAlign = 'center'
                ctx.font = `bold ${fontSize}px helvetica`
                ctx.fillText(label, pos[0], pos[1] - Math.round(.75 * fontSize))
            } else if (orientation.match(/^s$/i)) {
                ctx.textAlign = 'center'
                ctx.font = `bold ${fontSize}px helvetica`
                ctx.fillText(label, pos[0], pos[1] + Math.round(2.5 * fontSize))
            } else if (orientation.match(/^w$/i)) {
                ctx.textAlign = 'right'
                ctx.font = `bold ${fontSize}px helvetica`
                ctx.fillText(label, pos[0] - Math.round(.5 * fontSize), pos[1] + fontSize * .25)
            } else if (orientation.match(/^e$/i)) {
                ctx.textAlign = 'left'
                ctx.font = `bold ${fontSize}px helvetica`
                ctx.fillText(label, pos[0] + Math.round(.5 * fontSize), pos[1] + fontSize * .25)
            }
            ctx.fill()
        }
        ctx.restore()
    } catch (error) {       
        console.error(error.message)
    }
}