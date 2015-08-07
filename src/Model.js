define(["Phaser", "Camera"],
    function (Phaser, Camera)
    {
        var Model = function (parent, vertices, indices, uvs, key, frame)
        {
            this.faceSize = 3;
            this.matrix = Matrix.I(4);
            this.graphics = game.add.graphics(0, 0);
            parent = parent || game.world;

            this.vertices = vertices;
            this.indices = indices;
            this.uvs = uvs;
            this.faces = [];
            //this.baseColor = [200 + Math.random()*55, 100 + Math.random()*155, 100 + Math.random()*155];
            this.baseColor = [255, 0, 0];

            this.geometry = new Phaser.Geometry(game, key, frame, null /* verts */, null /* indices */);
            parent.add(this.geometry);


            this.updateGeometry();
        };

        Model.prototype = {
            get z(){
                var pos = this.getPosition();
                var camPos = Camera.getInstance().getPosition();
                return pos.distanceFrom(camPos);
            }
        };

        Model.prototype.constructor = Model;

        Model.prototype.setPosition = function (pos)
        {
            this.matrix.setPosition(pos);
        };

        Model.prototype.getPosition = function ()
        {
            return this.matrix.getPosition();
        };

        Model.prototype.setRotation = function (euler)
        {
            var rotationX = Matrix.Rotation4X(euler.elements[0]);
            var rotationY = Matrix.Rotation4Y(euler.elements[1]);
            var rotationZ = Matrix.Rotation4Z(euler.elements[2]);
            this.matrix = this.matrix.multiply(rotationZ.multiply((rotationY.multiply(rotationX))));
        };

        Model.prototype.normalizeProjectedVector = function (vec)
        {
            vec = vec.multiply(1 / vec.elements[2]);
            vec = vec.multiply(game.width);
            vec.elements[1] *= -1;
            return vec;
        };

        Model.prototype.vector3to4 = function (vec)
        {
            var vec4 = vec.dup();
            vec4.elements.push(1);
            return vec4;
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
            var aSum = Vector.Zero(3);

            for(var i=0; i< this.faceSize; i++)
            {
                aSum = aSum.add(source.vertices[i]);
            }
            var aAvg = aSum.multiply(1/source.vertices.length);

            aAvg = this.vector3to4(aAvg);
            aAvg = this.matrix.multiply(aAvg);

            var aDist = aAvg.distanceFrom(other);

            return aDist;
        };

        Model.prototype.sortFaces = function ()
        {
            var camPos = this.vector3to4(Camera.getInstance().getPosition());

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

                var lightPos = Vector.create([200, 200, 300]);
                var length = 1500;

                var light = this.faceDistTo(face, this.vector3to4(lightPos))/length;
                face.lightDistance = (1 - light)*(1 - light);

                face.uvs.forEach(function(uv){
                    uvs.push(uv.elements[0]);
                    uvs.push(uv.elements[1]);
                }, this);

                face.vertices.forEach(function(vertex){

                    var pos = this.vector3to4(vertex);
                    pos = this.matrix.multiply(pos);

                    pos = Camera.getInstance().matrix.multiply(pos);
                    pos = this.normalizeProjectedVector(pos);

                    verts.push(pos.elements[0]);
                    verts.push(pos.elements[1]);

                    lighting.push(face.lightDistance);

                }, this);

            }, this);

            this.geometry.vertices = new PIXI.Float32Array(verts);
            this.geometry.indices = new PIXI.Uint16Array(this.indices);
            this.geometry.lighting = lighting;
            this.geometry.uvs = new PIXI.Float32Array(uvs);

            var pos = this.getPosition();
            var camPos = Camera.getInstance().getPosition();
            var zPos = pos.distanceFrom(camPos);

            this.geometry.z = zPos;


            //this.graphics.endFill();
        };

        Model.prototype.update = function ()
        {
            var pos = this.getPosition();
            var camPos = Camera.getInstance().getPosition();
            if(camPos.elements[2] < pos.elements[2])
            {
                this.geometry.visible = false;
            }
            else
                this.geometry.visible = true;
        };

        Model.prototype.render = function ()
        {
            if(this.geometry.visible)
                this.updateGeometry();
        };

        return Model;
    });


