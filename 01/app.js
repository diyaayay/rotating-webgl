var vertexShaderText =
[
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    'attribute vec3 vertColor;',
    'varying vec3 fragColor;',
    '',
    'void main()',
    '{',
    'fragColor=vertColor;',
    'gl_Position = vec4(vertPosition, 0.0, 1.0);',
    '}'
].join("\n"); 

var fragmentShaderText = [
    'precision mediump float;',
    '',
    'varying vec3 fragColor;',
    'void main()',
    '{',
    `gl_FragColor= vec4(fragColor,1.0);`,
    '}'
].join("\n");


var InitDemo = function () {
    console.log("This is working");

    var canvas = document.getElementById("game-surface");

    var gl = canvas.getContext("webgl");

    if(!gl){
        console.log("WebGl not supported, falling back to experimental webGl");
        gl = canvas.getContext("experimental-webgl");
    }

    if(!gl){
        alert("Your browser does not support webGl");
    }

    gl.clearColor(0.75,0.85,0.8,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    //CREATE SHADERS
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
        console.error("Error compiling vertex shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
        console.error("Error compiling fragment shader!", gl.getShaderInfoLog(vertexShader));
        return;
    }

    //entire graphics pipeline program

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error("Error linking Program", gl.getProgramInfoLog(program));
        return;
    }

    //catch additional program
    gl.validateProgram(program)
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error("Error Validating Program", gl.getProgramInfoLog(program));
        return;
    }


    var triangleVertices = [
        0.0,0.5,    1.0,1.0,0.0,
        -0.5,-0.5,    0.7,0.9,1.0,
        0.5,0.5,         0.5,1.0,0.6

    ];

//to send to GPU
    var triangleBufferVertexObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleBufferVertexObject);
    //uses the last bound buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    //static draw means we're not gonna change the triangle

    var positionAttributeLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttributeLocation = gl.getAttribLocation(program, 'vertColor');
    //specify layout
    gl.vertexAttribPointer(
        positionAttributeLocation, //attriblocation
        2, //no of elements in each attrib,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,//size of an individual vertex
    2* Float32Array.BYTES_PER_ELEMENT
    );
    gl.vertexAttribPointer(
        colorAttributeLocation, //attriblocation
        3, //no of elements in each attrib,
        gl.FLOAT,
        gl.FALSE,
        5 * Float32Array.BYTES_PER_ELEMENT,//size of an individual vertex
        0
    );
//enable vertex attrib array
gl.enableVertexAttribArray(positionAttributeLocation);
gl.enableVertexAttribArray(colorAttributeLocation);


//
// Main render loop
//
// var loop = function () {
//     updateWorld();
//     renderWorld();
//     if (running) {
//         requestAnimationFrame(loop);
//     }
// } no animation currently

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);


};
// const vertexShader = function (vertPosition,vertColor){
//     return {
//         fragColor: [vertColor]
//     }
// };