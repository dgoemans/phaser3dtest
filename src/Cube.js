define(["Phaser", "glMatrix", "Model"],
    function(Phaser, GL, Model)
    {
        var Cube = function (parent, x, y, z)
        {
            this.models = null;
            var indices = [0, 1, 2, 2, 3, 0,
                3, 2, 6, 6, 7, 3,
                7, 6, 5, 5, 4, 7,
                4, 0, 3, 3, 7, 4,
                0, 1, 5, 5, 4, 0,
                1, 5, 6, 6, 2, 1 ];

            var uvs = [];
            uvs.push(GL.vec2.fromValues(0, 0));
            uvs.push(GL.vec2.fromValues(1, 0));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(0, 1));
            uvs.push(GL.vec2.fromValues(0, 0));

            uvs.push(GL.vec2.fromValues(0, 0));
            uvs.push(GL.vec2.fromValues(1, 0));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(0, 1));
            uvs.push(GL.vec2.fromValues(0, 0));

            uvs.push(GL.vec2.fromValues(0, 0));
            uvs.push(GL.vec2.fromValues(1, 0));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(0, 1));
            uvs.push(GL.vec2.fromValues(0, 0));

            uvs.push(GL.vec2.fromValues(0, 0));
            uvs.push(GL.vec2.fromValues(1, 0));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(0, 1));
            uvs.push(GL.vec2.fromValues(0, 0));

            uvs.push(GL.vec2.fromValues(0, 0));
            uvs.push(GL.vec2.fromValues(1, 0));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(0, 1));
            uvs.push(GL.vec2.fromValues(0, 0));

            uvs.push(GL.vec2.fromValues(0, 0));
            uvs.push(GL.vec2.fromValues(1, 0));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(0, 1));
            uvs.push(GL.vec2.fromValues(0, 0));

            var cubeSize = 10;

            var vertices = [];
            vertices.push(GL.vec3.fromValues(-cubeSize, -cubeSize, cubeSize));
            vertices.push(GL.vec3.fromValues(cubeSize, -cubeSize, cubeSize));
            vertices.push(GL.vec3.fromValues(cubeSize, cubeSize, cubeSize));
            vertices.push(GL.vec3.fromValues(-cubeSize, cubeSize, cubeSize));
            vertices.push(GL.vec3.fromValues(-cubeSize, -cubeSize, -cubeSize));
            vertices.push(GL.vec3.fromValues(cubeSize, -cubeSize, -cubeSize));
            vertices.push(GL.vec3.fromValues(cubeSize, cubeSize, -cubeSize));
            vertices.push(GL.vec3.fromValues(-cubeSize, cubeSize, -cubeSize));

            this.models = new Model(parent, vertices, indices, uvs, "road");
            this.models.setPosition(GL.vec3.fromValues(x,y,z));
        };

        Cube.prototype.constructor = Cube;

        Cube.prototype.update = function() {
            this.models.update();
        };

        Cube.prototype.render = function() {
            this.models.render();
        };

        return Cube;
    }
);