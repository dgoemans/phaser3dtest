define(["Phaser","Camera"],
    function(Phaser, Camera)
    {
        var Model = function (vertices)
        {
            this.matrix = Matrix.I(4);
            this.graphics = game.add.graphics(0,0);

            this.vertices = vertices;
            //this.baseColor = [200 + Math.random()*55, 100 + Math.random()*155, 100 + Math.random()*155];
            this.baseColor = [255,0,0];
            this.updateGeometry();
        };


        Model.prototype.constructor = Model;

        Model.prototype.setPosition = function(pos)
        {
            this.matrix.setPosition(pos);
        };

        Model.prototype.getPosition = function()
        {
            return this.matrix.getPosition();
        };

        Model.prototype.setRotation = function(euler)
        {
            var rotationX = Matrix.Rotation4X(euler.elements[0]);
            var rotationY = Matrix.Rotation4Y(euler.elements[1]);
            var rotationZ = Matrix.Rotation4Z(euler.elements[2]);
            this.matrix = this.matrix.multiply(rotationZ.multiply((rotationY.multiply(rotationX))));
        };

        Model.prototype.normalizeProjectedVector = function(vec)
        {
            vec = vec.multiply(1/vec.elements[2]);
            vec = vec.multiply(game.width);
            vec.elements[1] *= -1;
            return vec;
        };

        Model.prototype.vector3to4 = function(vec)
        {
            var vec4 = vec.dup();
            vec4.elements.push(1);
            return vec4;
        };

        Phaser.Color.toRGB = function (r, g, b) {

            return (r << 16) | (g << 8) | b;

        };


        Model.prototype.updateGeometry = function() {

            this.graphics.clear();
            //this.graphics.lineStyle(1, 0x0000FF, 1);

            this.graphics.beginFill(0xFF0000, 1);

            var pos = this.vector3to4(this.vertices[0]);
            pos = this.matrix.multiply(pos);
            pos = Camera.getInstance().matrix.multiply(pos);
            pos = this.normalizeProjectedVector(pos);

            this.graphics.moveTo(pos.elements[0],pos.elements[1]);
            var lightPos = Vector.create([20,20,30]);
            var length = lightPos.modulus() + 0;

            for(var i=1; i<=this.vertices.length; i++)
            {
                pos = this.vector3to4(this.vertices[i%this.vertices.length]);
                pos = this.matrix.multiply(pos);
                var dist = pos.distanceFrom(this.vector3to4(lightPos));
                pos = Camera.getInstance().matrix.multiply(pos);
                //var origString = "(" + pos.elements[0].toFixed(1) + ", " + pos.elements[1].toFixed(1) + ", " + pos.elements[2].toFixed(1) + ")";
                pos = this.normalizeProjectedVector(pos);

                var color = this.baseColor.clone();
                for(var j=0; j<color.length; j++)
                {
                    color[j] = color[j]*0.7 + color[j]*0.3*(1 - dist/length*dist/length);
                }

                var vColor = Phaser.Color.toRGB(color[0], color[1], color[2]);
                this.graphics.beginFill(vColor, 1);
                this.graphics.lineTo(pos.elements[0],pos.elements[1]);


                //var transformedString = "(" + pos.elements[0].toFixed(1) + ", " + pos.elements[1].toFixed(1) + ", " + pos.elements[2].toFixed(1) + ")";
                //console.log("Orig: " + origString + "  |  Trans: " + transformedString);
            }

            this.graphics.endFill();
        };

        Model.prototype.update = function ()
        {
        };

        Model.prototype.render = function()
        {
            this.updateGeometry();
        };

        return Model;
    });


