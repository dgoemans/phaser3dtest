define(["Phaser","Camera"],
    function(Phaser, Camera)
    {
        var Model = function (vertices)
        {
            this.matrix = Matrix.I(4);
            this.graphics = game.add.graphics(0,0);

            this.vertices = vertices;
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

        Model.prototype.updateGeometry = function() {

            var pos = this.getPosition();
            var camPos = Camera.getInstance().getPosition();

            var dist = pos.distanceFrom(camPos);

            this.graphics.clear();
            //this.graphics.lineStyle(2, 0x0000FF, 1);
            this.graphics.beginFill(0xFF3300, 1);

            var pos = this.vector3to4(this.vertices[0]);
            pos = this.matrix.multiply(pos);
            pos = Camera.getInstance().matrix.multiply(pos);
            pos = this.normalizeProjectedVector(pos);

            this.graphics.moveTo(pos.elements[0],pos.elements[1]);

            for(var i=1; i<=this.vertices.length; i++)
            {
                pos = this.vector3to4(this.vertices[i%this.vertices.length]);
                pos = this.matrix.multiply(pos);
                pos = Camera.getInstance().matrix.multiply(pos);

                var origString = "(" + pos.elements[0].toFixed(1) + ", " + pos.elements[1].toFixed(1) + ", " + pos.elements[2].toFixed(1) + ")";
                pos = this.normalizeProjectedVector(pos);

                this.graphics.lineTo(pos.elements[0],pos.elements[1]);

                var transformedString = "(" + pos.elements[0].toFixed(1) + ", " + pos.elements[1].toFixed(1) + ", " + pos.elements[2].toFixed(1) + ")";
                //console.log("Orig: " + origString + "  |  Trans: " + transformedString);
            }

            this.graphics.endFill();
        };

        Model.prototype.update = function ()
        {
            return;
            var t = game.time.elapsed/500;
            var rotation = Matrix.Rotation4Y(t);
            this.matrix = this.matrix.multiply(rotation);

            return;
            var t = game.time.elapsed/500;
            var rotation = Matrix.Rotation4Z(t);
            this.matrix = this.matrix.multiply(rotation);


            //this.matrix.setPosition(Vector.create([0,Math.sin(game.time.totalElapsedSeconds())*5,0]))
        };

        Model.prototype.render = function()
        {
            this.updateGeometry();
        };

        return Model;
    });


