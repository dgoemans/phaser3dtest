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

            // set up the main bits..
            this.uvs = new PIXI.Float32Array([0, 0,
                1, 0,
                1, 1,
                0, 1]);

            this.verticies = new PIXI.Float32Array([0, 0,
                100, 0,
                100, 100,
                0, 100]);

            this.colors = new PIXI.Float32Array([1, 1, 1, 1]);

            this.indices = new PIXI.Uint16Array([0, 1, 2, 0, 2, 3]);

            /**
             * Whether the geometry is dirty or not
             *
             * @property dirty
             * @type Boolean
             */
            this.dirty = true;
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
            this._colorBuffer = gl.createBuffer();

            gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.DYNAMIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this._uvBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        };

        PIXI.Geometry.prototype._renderGeometry = function (renderSession)
        {
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
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.verticies);
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
                gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.STATIC_DRAW);
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
            //console.log(gl.TRIANGLES)
            //
            //
            gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);


        };


        PIXI.Geometry.prototype._renderCanvas = function (renderSession)
        {
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
            var verticies = geometry.verticies;
            var uvs = geometry.uvs;

            var length = verticies.length / 2;
            this.count++;

            for (var i = 0; i < length - 2; i++)
            {
                // draw some triangles!
                var index = i * 2;

                var x0 = verticies[index], x1 = verticies[index + 2], x2 = verticies[index + 4];
                var y0 = verticies[index + 1], y1 = verticies[index + 3], y2 = verticies[index + 5];

                if (this.padding > 0)
                {
                    var centerX = (x0 + x1 + x2) / 3;
                    var centerY = (y0 + y1 + y2) / 3;

                    var normX = x0 - centerX;
                    var normY = y0 - centerY;

                    var dist = Math.sqrt(normX * normX + normY * normY);
                    x0 = centerX + (normX / dist) * (dist + 3);
                    y0 = centerY + (normY / dist) * (dist + 3);

                    //

                    normX = x1 - centerX;
                    normY = y1 - centerY;

                    dist = Math.sqrt(normX * normX + normY * normY);
                    x1 = centerX + (normX / dist) * (dist + 3);
                    y1 = centerY + (normY / dist) * (dist + 3);

                    normX = x2 - centerX;
                    normY = y2 - centerY;

                    dist = Math.sqrt(normX * normX + normY * normY);
                    x2 = centerX + (normX / dist) * (dist + 3);
                    y2 = centerY + (normY / dist) * (dist + 3);
                }

                var u0 = uvs[index] * geometry.texture.width, u1 = uvs[index + 2] * geometry.texture.width, u2 = uvs[index + 4] * geometry.texture.width;
                var v0 = uvs[index + 1] * geometry.texture.height, v1 = uvs[index + 3] * geometry.texture.height, v2 = uvs[index + 5] * geometry.texture.height;

                context.save();
                context.beginPath();

                context.moveTo(x0, y0);
                context.lineTo(x1, y1);
                context.lineTo(x2, y2);

                context.closePath();

                context.clip();

                // Compute matrix transform
                var delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
                var deltaA = x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2;
                var deltaB = u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2;
                var deltaC = u0 * v1 * x2 + v0 * x1 * u2 + x0 * u1 * v2 - x0 * v1 * u2 - v0 * u1 * x2 - u0 * x1 * v2;
                var deltaD = y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2;
                var deltaE = u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2;
                var deltaF = u0 * v1 * y2 + v0 * y1 * u2 + y0 * u1 * v2 - y0 * v1 * u2 - v0 * u1 * y2 - u0 * y1 * v2;

                context.transform(deltaA / delta, deltaD / delta,
                    deltaB / delta, deltaE / delta,
                    deltaC / delta, deltaF / delta);

                context.drawImage(geometry.texture.baseTexture.source, 0, 0);
                context.restore();
            }
        };


        /**
         * Renders a flat geometry
         *
         * @method renderGeometryFlat
         * @param geometry {Geometry} The Geometry to render
         * @private
         */
        PIXI.Geometry.prototype.renderGeometryFlat = function (geometry)
        {
            var context = this.context;
            var verticies = geometry.verticies;

            var length = verticies.length / 2;
            this.count++;

            context.beginPath();
            for (var i = 1; i < length - 2; i++)
            {
                // draw some triangles!
                var index = i * 2;

                var x0 = verticies[index], x1 = verticies[index + 2], x2 = verticies[index + 4];
                var y0 = verticies[index + 1], y1 = verticies[index + 3], y2 = verticies[index + 5];

                context.moveTo(x0, y0);
                context.lineTo(x1, y1);
                context.lineTo(x2, y2);
            }

            context.fillStyle = "#FF0000";
            context.fill();
            context.closePath();
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

        Phaser.Geometry = function (game, key, frame, vertices, indices)
        {
            PIXI.Geometry.call(this, PIXI.TextureCache['__default']);

            if(vertices) this.vertices = vertices;
            if(indices) this.indices = indices;

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