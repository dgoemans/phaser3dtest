define(["Phaser", "Camera"],
    function (Phaser, Camera)
    {
        var Model = function (vertices, indices, faceSize)
        {
            this.faceSize = faceSize || 3;
            this.matrix = Matrix.I(4);
            this.graphics = game.add.graphics(0, 0);

            this.vertices = vertices;
            this.indices = indices;
            this.faces = [];
            //this.baseColor = [200 + Math.random()*55, 100 + Math.random()*155, 100 + Math.random()*155];
            this.baseColor = [255, 0, 0];
            this.updateGeometry();
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
            this.faces = [];
            var vertex = null;
            for (var i = 0; i < this.indices.length; i += this.faceSize)
            {
                vertex = [];
                for (var j = 0; j < this.faceSize; j++)
                    vertex.push(this.vertices[this.indices[i + j]]);
                this.faces.push(vertex);
            }
        };

        Model.prototype.sortFaces = function ()
        {
            var camPos = this.vector3to4(Camera.getInstance().getPosition());

            this.faces.sort(function(a,b){

                var aSum = Vector.Zero(3);
                var bSum = Vector.Zero(3);

                for(var i=0; i< this.faceSize; i++)
                {
                    aSum = aSum.add(a[i]);
                    bSum = bSum.add(b[i]);
                }
                var aAvg = aSum.multiply(1/a.length);
                var bAvg = bSum.multiply(1/b.length);

                aAvg = this.vector3to4(aAvg);
                aAvg = this.matrix.multiply(aAvg);

                bAvg = this.vector3to4(bAvg);
                bAvg = this.matrix.multiply(bAvg);

                var aDist = aAvg.distanceFrom(camPos);
                var bDist = bAvg.distanceFrom(camPos);

                return bDist - aDist;
            }.bind(this));
        };

        Model.prototype.updateGeometry = function ()
        {

            if (!this.faces.length)
                this.regenFaces();

            this.sortFaces();

            this.graphics.clear();
            this.graphics.beginFill(Phaser.Color.toRGB(this.baseColor[0], this.baseColor[1], this.baseColor[2]), 1);

            this.faces.forEach(function(face){

                var lightPos = Vector.create([20, 20, 30]);
                var length = lightPos.modulus() + 0;

                var last = face[this.faceSize-1];
                var pos = this.vector3to4(last);
                pos = this.matrix.multiply(pos);
                pos = Camera.getInstance().matrix.multiply(pos);
                pos = this.normalizeProjectedVector(pos);

                this.graphics.moveTo(pos.elements[0], pos.elements[1]);

                face.forEach(function(vertex){

                    var pos = this.vector3to4(vertex);
                    pos = this.matrix.multiply(pos);
                    var dist = pos.distanceFrom(this.vector3to4(lightPos));
                    pos = Camera.getInstance().matrix.multiply(pos);
                    pos = this.normalizeProjectedVector(pos);

                    var color = this.baseColor.clone();
                    for (var j = 0; j < color.length; j++)
                    {
                        color[j] = color[j] * 0.7 + color[j] * 0.3 * (1 - dist / length * dist / length);
                    }

                    var vColor = Phaser.Color.toRGB(color[0], color[1], color[2]);
                    //if(pos.elements[0] > -game.width/2 && pos.elements[0] < game.width/2 &&
                    //   pos.elements[1] > -game.height/2 && pos.elements[1] < game.height/2)
                    //{
                        this.graphics.beginFill(vColor, 1);
                        this.graphics.lineTo(pos.elements[0], pos.elements[1]);
                    //}
                    //else
                    //{
                    //    this.graphics.moveTo(pos.elements[0], pos.elements[1]);
                    //}


                }, this);

            }, this);

            this.graphics.endFill();
        };

        Model.prototype.update = function ()
        {
        };

        Model.prototype.render = function ()
        {
            this.updateGeometry();
        };

        return Model;
    });


