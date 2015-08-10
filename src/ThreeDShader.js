define(["Phaser", "glMatrix"],
    function(Phaser, GL)
    {
        function ThreeDShader(gl)
        {
            /**
             * @property _UID
             * @type Number
             * @private
             */
            this._UID = PIXI._UID++;

            /**
             * @property gl
             * @type WebGLContext
             */
            this.gl = gl;

            /**
             * The WebGL program.
             * @property program
             * @type {Any}
             */
            this.program = null;

            /**
             * The fragment shader.
             * @property fragmentSrc
             * @type Array
             */
            this.fragmentSrc = [
                'precision mediump float;',
                'varying vec2 vTextureCoord;',
                //   'varying float vColor;',
                'uniform float alpha;',
                'uniform sampler2D uSampler;',

                'void main(void) {',
                '   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));',
                //  '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',//gl_FragColor * alpha;',
                '}'
            ];

            /**
             * The vertex shader.
             * @property vertexSrc
             * @type Array
             */
            this.vertexSrc  = [
                'attribute vec3 aVertexPosition;',
                'attribute vec2 aTextureCoord;',
                'uniform mat4 model;',
                'uniform mat4 view;',
                'uniform mat4 projection;',
                'uniform vec2 offsetVector;',
                'varying vec2 vTextureCoord;',

                'void main(void) {',
                '   vec4 position = vec4(aVertexPosition, 1);',
                '   gl_Position = projection * view * model * position;',
                '   vTextureCoord = aTextureCoord;',
                // '   vColor = aColor * vec4(tint * alpha, alpha);',
                '}'
            ];

            this.init();
        };

        ThreeDShader.prototype.constructor = ThreeDShader;

        /**
         * Initialises the shader.
         *
         * @method init
         */
        ThreeDShader.prototype.init = function()
        {
            var gl = this.gl;

            var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
            gl.useProgram(program);

            // get and store the uniforms for the shader
            this.uSampler = gl.getUniformLocation(program, 'uSampler');
            this.model = gl.getUniformLocation(program, 'model');
            this.view = gl.getUniformLocation(program, 'view');
            this.projection = gl.getUniformLocation(program, 'projection');
            this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
            this.colorAttribute = gl.getAttribLocation(program, 'aColor');
            //this.dimensions = gl.getUniformLocation(this.program, 'dimensions');

            // get and store the attributes
            this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
            this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');

            this.attributes = [this.aVertexPosition, this.aTextureCoord];

            this.alpha = gl.getUniformLocation(program, 'alpha');

            this.program = program;
        };

        /**
         * Destroys the shader.
         *
         * @method destroy
         */
        ThreeDShader.prototype.destroy = function()
        {
            this.gl.deleteProgram( this.program );
            this.uniforms = null;
            this.gl = null;

            this.attribute = null;
        };

        return ThreeDShader;
    });
