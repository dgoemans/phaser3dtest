define(["Phaser"],
    function(Phaser)
    {
        /**
         *
         * @class Geometry
         * @extends DisplayObjectContainer
         * @constructor
         * @param texture {Texture} The texture to use
         * @param width {Number} the width
         * @param height {Number} the height
         *
         */
        PIXI.Geometry = function (texture)
        {
            PIXI.DisplayObjectContainer.call(this);


            /**
             * The texture of the geometry
             *
             * @property texture
             * @type Texture
             */
            this.texture = texture;

            this.z = 0;

            // set up the main bits..
            this.uvs = new PIXI.Float32Array([0, 0,
                1, 0,
                1, 1,
                0, 1]);

            this.vertices = new PIXI.Float32Array([0, 0,
                100, 0,
                100, 100,
                0, 100]);

            this.lighting = [0, 0, 0, 0, 0];


            //this.colors = new PIXI.Float32Array([1, 1, 1, 1]);

            this.indices = new PIXI.Uint16Array([0, 1, 2, 0, 2, 3]);

            /**
             * Whether the geometry is dirty or not
             *
             * @property dirty
             * @type Boolean
             */
            this.dirty = true;

            this.XBOUND = game.width/2;
            this.YBOUND = game.height/2;
        };

        // constructor
        PIXI.Geometry.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
        PIXI.Geometry.prototype.constructor = PIXI.Geometry;

        PIXI.Geometry.prototype._renderWebGL = function (renderSession)
        {
            // if the sprite is not visible or the alpha is 0 then no need to render this element
            if (!this.visible || this.alpha <= 0)return;
            // render triangle geometry..

            renderSession.spriteBatch.stop();

            // init! init!
            if (!this._vertexBuffer)this._initWebGL(renderSession);

            renderSession.shaderManager.setShader(renderSession.shaderManager.stripShader);

            this._renderGeometry(renderSession);

            ///renderSession.shaderManager.activateDefaultShader();

            renderSession.spriteBatch.start();

            //TODO check culling
        };

        PIXI.Geometry.prototype._initWebGL = function (renderSession)
        {
            // build the geometry!
            var gl = renderSession.gl;

            this._vertexBuffer = gl.createBuffer();
            this._indexBuffer = gl.createBuffer();
            this._uvBuffer = gl.createBuffer();
            //this._colorBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);

            //gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
            //gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        };

        PIXI.Geometry.prototype._renderGeometry = function (renderSession)
        {
            if(!this.visible)
                return;

            var gl = renderSession.gl;
            var projection = renderSession.projection,
                offset = renderSession.offset,
                shader = renderSession.shaderManager.stripShader;


            // gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mat4Real);

            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

            // set uniforms
            gl.uniformMatrix3fv(shader.translationMatrix, false, this.worldTransform.toArray(true));
            gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
            gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);
            gl.uniform1f(shader.alpha, this.worldAlpha);

            if (!this.dirty)
            {

                gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertices);
                gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

                // update the uvs
                gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
                gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

                gl.activeTexture(gl.TEXTURE0);

                // check if a texture is dirty..
                if (this.texture.baseTexture._dirty[gl.id])
                {
                    renderSession.renderer.updateTexture(this.texture.baseTexture);
                }
                else
                {
                    // bind the current texture
                    gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id]);
                }

                // dont need to upload!
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);


            }
            else
            {

                this.dirty = false;
                gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.STATIC_DRAW);
                gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

                // update the uvs
                gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
                gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
                gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

                gl.activeTexture(gl.TEXTURE0);

                // check if a texture is dirty..
                if (this.texture.baseTexture._dirty[gl.id])
                {
                    renderSession.renderer.updateTexture(this.texture.baseTexture);
                }
                else
                {
                    gl.bindTexture(gl.TEXTURE_2D, this.texture.baseTexture._glTextures[gl.id]);
                }

                // dont need to upload!
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

            }

            //gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
            gl.drawArrays(gl.TRIANGLES, 0, this.indices.length);

        };

        PIXI.Geometry.prototype._inBounds = function (x0,y0)
        {
            return x0 <= this.XBOUND && x0 >= -this.XBOUND && y0 >= -this.YBOUND && y0 <= this.YBOUND;
        };

        PIXI.Geometry.prototype._inBoundsX = function (x0)
        {
            return x0 <= this.XBOUND && x0 >= -this.XBOUND;
        };

        PIXI.Geometry.prototype._inBoundsY = function (y0)
        {
            return y0 >= -this.YBOUND && y0 <= this.YBOUND;
        };

        PIXI.Geometry.prototype._bound = function (x0,y0)
        {
            return {x: Math.min(Math.max(-this.XBOUND,x0),this.XBOUND), y: Math.min(Math.max(-this.YBOUND,y0),this.YBOUND)};
        };

        Math.bound = function(val, min, max)
        {
            return Math.min(Math.max(val,min),max);
        };

        PIXI.Geometry.prototype.boundTriangle = function(x0, y0, x1, y1, x2, y2)
        {
            var obj = {};

            // If it's in bounds, then swap with others to make further math 'cleaner'
            if(this._inBounds(x0,y0))
            {
                if(!this._inBounds(x1,y1))
                {
                    var x = x0,y = y0;
                    x0 = x1; y0 = y1;
                    x1 = x; y1 = y;
                }
                else if(!this._inBounds(x2,y2))
                {
                    var x = x0,y = y0;
                    x0 = x2; y0 = y2;
                    x2 = x; y2 = y;
                }
            }

            // do the bounds calc
            if(!this._inBounds(x0,y0))
            {
                var xp, yp;
                if(this._inBounds(x1,y1))
                {
                    xp = x1;
                    yp = y1;
                }
                else if(this._inBounds(x2,y2))
                {
                    xp = x2;
                    yp = y2;
                }
                else
                {
                    obj.x0 = x0;
                    obj.y0 = y0;
                    obj.x1 = x1;
                    obj.y1 = y1;
                    obj.x2 = x2;
                    obj.y2 = y2;
                    return obj;
                }

                var yr = y0;
                var xr = x0;
                // Y is out of bounds
                if(this._inBoundsX(x0))
                {

                    if(y0 < -this.YBOUND)
                    {
                        yr = -this.YBOUND;
                    }
                    else
                    {
                        yr = this.YBOUND;
                    }

                    xr = (yr - yp)*(x0 - xp)/(y0 - yp) + xp;

                }
                else
                {
                    if(x0 < -this.XBOUND)
                    {
                        xr = -this.XBOUND;
                    }
                    else
                    {
                        xr = this.XBOUND;
                    }

                    yr = (xr - xp)*(y0 - yp)/(x0 - xp) + yp;
                }



                x0 = xr;
                y0 = yr;
            }

            obj.x0 = x0;
            obj.y0 = y0;
            obj.x1 = x1;
            obj.y1 = y1;
            obj.x2 = x2;
            obj.y2 = y2;

            return obj;
        };

        PIXI.Geometry.prototype.inBoundsTri = function(x0,y0,x1,y1,x2,y2)
        {
            var in0 = this._inBounds(x0, y0);
            var in1 = this._inBounds(x1, y1);
            var in2 = this._inBounds(x2, y2);

            return in0 && in1 && in2;
        };

        PIXI.Geometry.prototype.boundQuad = function()
        {

        };

        PIXI.Geometry.prototype._renderCanvas = function (renderSession)
        {
            if(!this.visible)
                return;

            var context = renderSession.context;

            var transform = this.worldTransform;

            if (renderSession.roundPixels)
            {
                context.setTransform(transform.a, transform.b, transform.c, transform.d, transform.tx | 0, transform.ty | 0);
            }
            else
            {
                context.setTransform(transform.a, transform.b, transform.c, transform.d, transform.tx, transform.ty);
            }

            var geometry = this;
            // draw triangles!!
            var vertices = geometry.vertices;
            var uvs = geometry.uvs;
            var indices = geometry.indices;

            this.count++;

            for (var i = 0; i < indices.length; i+=3)
            {
                // draw some triangles!
                var index1 = (i) * 2;
                var index2 = (i + 1) * 2;
                var index3 = (i + 2) * 2;

                var x0 = vertices[index1], x1 = vertices[index2], x2 = vertices[index3];
                var y0 = vertices[index1 + 1], y1 = vertices[index2 + 1], y2 = vertices[index3 + 1];

                var u0 = uvs[index1] * geometry.texture.width, u1 = uvs[index2] * geometry.texture.width, u2 = uvs[index3] * geometry.texture.width;
                var v0 = uvs[index1 + 1] * geometry.texture.height, v1 = uvs[index2 + 1] * geometry.texture.height, v2 = uvs[index3 + 1] * geometry.texture.height;



                var in0 = this._inBounds(x0, y0);
                var in1 = this._inBounds(x1, y1);
                var in2 = this._inBounds(x2, y2);
                if(!in0 && !in1 && !in2)
                    continue;

                var bound = false;
                if(bound)
                {
                    while (!this.inBoundsTri(x0, y0, x1, y1, x2, y2))
                    {
                        var obj = this.boundTriangle(x0, y0, x1, y1, x2, y2);
                        x0 = obj.x0;
                        y0 = obj.y0;
                        x1 = obj.x1;
                        y1 = obj.y1;
                        x2 = obj.x2;
                        y2 = obj.y2;
                    }
                }


                context.beginPath();

                context.moveTo(x0, y0);
                context.lineTo(x1, y1);
                context.lineTo(x2, y2);
                context.lineTo(x0, y0);

                context.closePath();


                var texture = false;

                if(texture)
                {
                    context.save();

                    context.globalAlpha = 1;
                    context.clip();

                    // Compute matrix transform
                    var delta  = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
                    var deltaA = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
                    var deltaB = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
                    var deltaC = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2;
                    var deltaD = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
                    var deltaE = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
                    var deltaF = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;

                    var scaleX = deltaA / delta;
                    var scaleY = deltaE / delta;
                    var skewX = deltaD / delta;
                    var skewY = deltaB / delta;
                    var transX = deltaC / delta;
                    var transY = deltaF / delta;

                    context.transform(scaleX, skewX, skewY, scaleY, transX, transY);

                    context.drawImage(geometry.texture.baseTexture.source, 0, 0);

                    context.restore();
                }
                else
                {

                    context.fillStyle="#FF0000";
                    context.fill();
                }

                var lighting = false;
                if(lighting)
                {
                    function decimalToHex(d) {
                        var hex = Number(d).toString(16);
                        hex = "00".substr(0, 2 - hex.length) + hex;
                        return hex;
                    }

                    context.globalAlpha = 1.0;
                    var lighting = 255*this.lighting[index1];
                    var val = decimalToHex(lighting) + "";
                    context.fillStyle = '#' + val + val + val;

                    context.globalCompositeOperation = "destination-atop";

                    context.fillRect(0, 0, geometry.texture.width, geometry.texture.height);


                    context.globalCompositeOperation = "destination-atop";
                    context.fillStyle = "#FFFFFF";
                    context.globalAlpha = 1.0;

                }
            }
        };


         PIXI.Geometry.prototype.setTexture = function(texture)
         {
             //TODO SET THE TEXTURES
             //TODO VISIBILITY

             // stop current texture
             this.texture = texture;
         };

        /**
         * When the texture is updated, this event will fire to update the scale and frame
         *
         * @method onTextureUpdate
         * @param event
         * @private
         */

        PIXI.Geometry.prototype.onTextureUpdate = function ()
        {
            this.updateFrame = true;
        };

        Phaser.Geometry = function (game, key, frame, vertices, indices, uvs)
        {
            PIXI.Geometry.call(this, PIXI.TextureCache['__default']);

            if(vertices) this.vertices = vertices;
            if(indices) this.indices = indices;
            if(uvs) this.uvs = uvs;

            Phaser.Component.Core.init.call(this, game, 0, 0, key, frame);
        };

        Phaser.Geometry.prototype = Object.create(PIXI.Geometry.prototype);
        Phaser.Geometry.constructor = Phaser.Geometry;

        Phaser.Component.Core.install.call(Phaser.Geometry.prototype, [
            'Angle',
            'Animation',
            'AutoCull',
            'Bounds',
            'BringToTop',
            'Crop',
            'Delta',
            'Destroy',
            'FixedToCamera',
            'InputEnabled',
            'InWorld',
            'LifeSpan',
            'LoadTexture',
            'Overlap',
            'PhysicsBody',
            'Reset',
            'ScaleMinMax',
            'Smoothed'
        ]);
    }
);