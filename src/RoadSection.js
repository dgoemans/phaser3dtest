define(["Phaser", "glMatrix", "Model"],
    function(Phaser, GL, Model)
    {
        var RoadSection = function (parent, x, y0, y1, z)
        {
            var wallSize = 3;
            var runwayWidth = 10;

            var wallLeft, wallRight, floor;

            this.models = [];

            var indices = [0, 1, 2, 2, 3, 0,
                3, 2, 6, 6, 7, 3,
                7, 6, 5, 5, 4, 7,
                4, 0, 3, 3, 7, 4,
                0, 1, 5, 5, 4, 0,
                1, 5, 6, 6, 2, 1];

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

            var normals = [];
            normals.push(GL.vec3.fromValues(0, 0, 1));
            normals.push(GL.vec3.fromValues(0, 0, 1));
            normals.push(GL.vec3.fromValues(0, 0, 1));
            normals.push(GL.vec3.fromValues(0, 0, 1));
            normals.push(GL.vec3.fromValues(0, 0, 1));
            normals.push(GL.vec3.fromValues(0, 0, 1));

            normals.push(GL.vec3.fromValues(0, 1, 0));
            normals.push(GL.vec3.fromValues(0, 1, 0));
            normals.push(GL.vec3.fromValues(0, 1, 0));
            normals.push(GL.vec3.fromValues(0, 1, 0));
            normals.push(GL.vec3.fromValues(0, 1, 0));
            normals.push(GL.vec3.fromValues(0, 1, 0));

            normals.push(GL.vec3.fromValues(0, 0, -1));
            normals.push(GL.vec3.fromValues(0, 0, -1));
            normals.push(GL.vec3.fromValues(0, 0, -1));
            normals.push(GL.vec3.fromValues(0, 0, -1));
            normals.push(GL.vec3.fromValues(0, 0, -1));
            normals.push(GL.vec3.fromValues(0, 0, -1));

            normals.push(GL.vec3.fromValues(-1, 0, 0));
            normals.push(GL.vec3.fromValues(-1, 0, 0));
            normals.push(GL.vec3.fromValues(-1, 0, 0));
            normals.push(GL.vec3.fromValues(-1, 0, 0));
            normals.push(GL.vec3.fromValues(-1, 0, 0));
            normals.push(GL.vec3.fromValues(-1, 0, 0));

            normals.push(GL.vec3.fromValues(0, -1, 0));
            normals.push(GL.vec3.fromValues(0, -1, 0));
            normals.push(GL.vec3.fromValues(0, -1, 0));
            normals.push(GL.vec3.fromValues(0, -1, 0));
            normals.push(GL.vec3.fromValues(0, -1, 0));
            normals.push(GL.vec3.fromValues(0, -1, 0));

            normals.push(GL.vec3.fromValues(1, 0, 0));
            normals.push(GL.vec3.fromValues(1, 0, 0));
            normals.push(GL.vec3.fromValues(1, 0, 0));
            normals.push(GL.vec3.fromValues(1, 0, 0));
            normals.push(GL.vec3.fromValues(1, 0, 0));
            normals.push(GL.vec3.fromValues(1, 0, 0));



            var vertices = [];
            var yDelta = y1 - y0;
            vertices.push(GL.vec3.fromValues(-wallSize, -wallSize, RoadSection.segLength / 2));
            vertices.push(GL.vec3.fromValues(wallSize, -wallSize, RoadSection.segLength / 2));
            vertices.push(GL.vec3.fromValues(wallSize, wallSize, RoadSection.segLength / 2));
            vertices.push(GL.vec3.fromValues(-wallSize, wallSize, RoadSection.segLength / 2));
            vertices.push(GL.vec3.fromValues(-wallSize, -wallSize + yDelta, -RoadSection.segLength / 2));
            vertices.push(GL.vec3.fromValues(wallSize, -wallSize + yDelta, -RoadSection.segLength / 2));
            vertices.push(GL.vec3.fromValues(wallSize, wallSize + yDelta, -RoadSection.segLength / 2));
            vertices.push(GL.vec3.fromValues(-wallSize, wallSize + yDelta, -RoadSection.segLength / 2));

            wallLeft = new Model(parent, vertices, indices, uvs, "floor");
            wallLeft.setPosition(GL.vec3.fromValues(x - runwayWidth - wallSize, y0 + wallSize, z + RoadSection.segLength / 2));
            this.models.push(wallLeft);

            wallRight = new Model(parent, vertices, indices, uvs, "floor");
            wallRight.setPosition(GL.vec3.fromValues(x + runwayWidth + wallSize, y0 + wallSize, z + RoadSection.segLength / 2));
            this.models.push(wallRight);

            vertices = [];
            vertices.push(GL.vec3.fromValues(-runwayWidth, yDelta, -RoadSection.segLength/2)); // R T B
            vertices.push(GL.vec3.fromValues(runwayWidth, yDelta, -RoadSection.segLength/2));  // R T F
            vertices.push(GL.vec3.fromValues(runwayWidth, 0, RoadSection.segLength/2)); // R B F
            vertices.push(GL.vec3.fromValues(-runwayWidth, 0, RoadSection.segLength/2));// R B B

            var uvs = [];
            uvs.push(GL.vec2.fromValues(0, 1));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(1, 0));

            uvs.push(GL.vec2.fromValues(0, 1));
            uvs.push(GL.vec2.fromValues(1, 0));
            uvs.push(GL.vec2.fromValues(0, 0));

            floor = new Model(parent, vertices, [0,1,2,0,2,3], uvs, "floor");
            floor.setPosition(GL.vec3.fromValues(x,y0,z + RoadSection.segLength/2));
            this.models.push(floor);

            this.x = x;
            this.y = y0;
            this.z = z;
        };

        RoadSection.prototype.constructor = RoadSection;

        RoadSection.prototype.update = function() {
            this.models.forEach(function(model){
               model.update();
            });
        };

        RoadSection.prototype.render = function() {
            this.models.forEach(function(model){
                model.render();
            });
        };

        RoadSection.prototype.destroy = function() {
            this.models.forEach(function(model){
                model.destroy();
            });
            this.models = [];
        };

        RoadSection.segLength = 200;

        return RoadSection;
    }
);