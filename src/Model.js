define(["Phaser", "Camera", "glMatrix"],
    function (Phaser, Camera, GL)
    {
        var Model = function (parent, vertices, indices, uvs, key, frame)
        {
            this.faceSize = 3;
            this.matrix = GL.mat4.create();
            parent = parent || game.world;

            this.vertices = vertices;
            this.indices = indices;
            this.uvs = uvs;
            this.faces = [];

            this.geometry = new Phaser.Geometry(game, key, frame, null /* verts */, null /* indices */);
            parent.add(this.geometry);


            this.updateGeometry();
        };

        Model.prototype = {
            get z(){
                var pos = this.getPosition();
                var camPos = Camera.getInstance().getPosition();
                return GL.vec3.distance(pos,camPos);
            }
        };

        Model.prototype.constructor = Model;

        Model.prototype.setPosition = function (pos)
        {
            GL.mat4.setTranslation(this.matrix, pos);
        };

        Model.prototype.getPosition = function ()
        {
            return GL.mat4.getTranslation(this.matrix);
        };

        Model.prototype.rotate = function (euler)
        {
            GL.mat4.rotateZ(this.matrix, this.matrix, euler[2]);
            GL.mat4.rotateY(this.matrix, this.matrix, euler[1]);
            GL.mat4.rotateX(this.matrix, this.matrix, euler[0]);
        };

        Phaser.Color.toRGB = function (r, g, b)
        {
            return (r << 16) | (g << 8) | b;
        };

        Model.prototype.regenFaces = function ()
        {
            var uvIndex = 0;
            this.faces = [];
            var vertices = null;
            var uvs = null;
            for (var i = 0; i < this.indices.length; i += this.faceSize)
            {
                uvs = [];
                vertices = [];
                for (var j = 0; j < this.faceSize; j++)
                {
                    vertices.push(this.vertices[this.indices[i + j]]);
                    uvs.push(this.uvs[uvIndex]);
                    uvIndex++;
                }

                this.faces.push({ vertices: vertices, uvs: uvs });
            }
        };

        Model.prototype.faceDistTo = function(source, other)
        {
            var aAvg = GL.vec3.create();
            var aSum = GL.vec3.create();

            for(var i=0; i< this.faceSize; i++)
            {
                GL.vec3.add(aSum, aSum,source.vertices[i]);
            }

            GL.vec3.scale(aAvg, aSum, 1/source.vertices.length);

            GL.vec3.transformMat4(aAvg, aAvg, this.matrix);

            var aDist = GL.vec3.distance(aAvg,other);

            return aDist;
        };

        Model.prototype.sortFaces = function ()
        {
            var camPos = Camera.getInstance().getPosition();

            this.faces.sort(function(a,b){
                return this.faceDistTo(b, camPos) - this.faceDistTo(a, camPos);
            }.bind(this));
        };

        Model.prototype.updateGeometry = function ()
        {

            if (!this.faces.length)
                this.regenFaces();

            this.sortFaces();
            //
            var verts = [];
            var uvs = [];
            var lighting = [];

            this.faces.forEach(function(face){

                var lightPos = GL.vec3.fromValues(200, 200, 300);
                var length = 1500;

                var light = this.faceDistTo(face, lightPos)/length;
                face.lightDistance = (1 - light)*(1 - light);

                face.uvs.forEach(function(uv){
                    uvs.push(uv[0]);
                    uvs.push(uv[1]);
                }, this);

                face.vertices.forEach(function(vertex){

                    verts.push(vertex[0]);
                    verts.push(vertex[1]);
                    verts.push(vertex[2]);

                    lighting.push(face.lightDistance);

                }, this);

            }, this);

            this.geometry.vertices = new PIXI.Float32Array(verts);
            this.geometry.indices = new PIXI.Uint16Array(this.indices);
            this.geometry.lighting = lighting;
            this.geometry.uvs = new PIXI.Float32Array(uvs);
            this.geometry.matrix = this.matrix;

            var pos = this.getPosition();
            var camPos = Camera.getInstance().getPosition();
            var zPos = GL.vec3.distance(pos,camPos);

            this.geometry.z = zPos;
        };

        Model.prototype.update = function ()
        {
            var pos = this.getPosition();
            var camPos = Camera.getInstance().getPosition();
            if(Math.abs(camPos[2] - pos[2]) > 2000)
                this.geometry.visible = false;
            else
                this.geometry.visible = true;
        };

        Model.prototype.render = function ()
        {
            if(this.geometry.visible)
                this.updateGeometry();
        };

        Model.prototype.destroy = function ()
        {
            this.geometry.visible = false;
            this.geometry.destroy();
            this.matrix = GL.mat4.create();

            this.vertices = null;
            this.indices = null;
            this.uvs = null;
            this.faces = null;
            this.geometry = null;

        };

        return Model;
    });


