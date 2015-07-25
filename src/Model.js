define(["Phaser","Camera"],
    function(Phaser, Camera)
    {
        var Model = function ()
        {
            this.position = Vector.Zero(4);
            this.graphics = game.add.graphics(0,0);

            this.vertices = [];
            //this.vertices.push(Vector.create([-50, 0, 600]));
            //this.vertices.push(Vector.create([-50, 0, -600]));
            //this.vertices.push(Vector.create([50, 0, -600]));
            //this.vertices.push(Vector.create([50, 0, 600]));

            this.vertices.push(Vector.create([-10, 10, 0]));
            this.vertices.push(Vector.create([-10, -10, 0]));
            this.vertices.push(Vector.create([10, -10, 0]));
            this.vertices.push(Vector.create([10, 10, 0]));

            this.updateGeometry();
        };


        Model.prototype.constructor = Model;

        Model.prototype.normalizeProjectedVector = function(vec)
        {
            //return vec;
            vec = vec.multiply(1/vec.elements[2]);
            vec = vec.multiply(game.width);
            return vec;
        };

        Model.prototype.vector3to4 = function(vec)
        {
            var vec4 = vec.dup();
            vec4.elements.push(1);
            return vec4;
        };

        Model.prototype.updateGeometry = function() {

            this.graphics.clear();
            this.graphics.lineStyle(2, 0x0000FF, 1);
            this.graphics.beginFill(0xFF3300);

            var vertex = this.vector3to4(this.vertices[0]);
            var pos = Camera.getInstance().matrix.multiply(vertex);
            pos = this.normalizeProjectedVector(pos);

            this.graphics.moveTo(pos.elements[0],pos.elements[1]);

            for(var i=1; i<=this.vertices.length; i++)
            {
                vertex = this.vector3to4(this.vertices[i%this.vertices.length]);
                pos = Camera.getInstance().matrix.multiply(vertex);

                var origString = "(" + pos.elements[0].toFixed(1) + ", " + pos.elements[1].toFixed(1) + ", " + pos.elements[2].toFixed(1) + ")";
                pos = this.normalizeProjectedVector(pos);

                this.graphics.lineTo(pos.elements[0],pos.elements[1]);

                var transformedString = "(" + pos.elements[0].toFixed(1) + ", " + pos.elements[1].toFixed(1) + ", " + pos.elements[2].toFixed(1) + ")";
                console.log("Orig: " + origString + "  |  Trans: " + transformedString);
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


