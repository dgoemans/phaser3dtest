define(["Phaser", "Sylvester"],
    function(Phaser, Sylvester)
    {
        Matrix.prototype.setPosition = function (vector)
        {
            this.elements[0][3] = vector.elements[0];
            this.elements[1][3] = vector.elements[1];
            this.elements[2][3] = vector.elements[2];
        };

        Matrix.prototype.getPosition = function ()
        {
            var vector = Vector.Zero(3);
            vector.elements[0] = this.elements[0][3];
            vector.elements[1] = this.elements[1][3];
            vector.elements[2] = this.elements[2][3];
            return vector;
        };


        // Special case rotations
        Matrix.Rotation4X = function(t)
        {
            var c = Math.cos(t), s = Math.sin(t);
            return Matrix.create([
                [  1,  0,  0, 0 ],
                [  0,  c, -s, 0 ],
                [  0,  s,  c, 0 ],
                [  0,  0,  0, 1 ]
            ]);
        };
        Matrix.Rotation4Y = function(t)
        {
            var c = Math.cos(t), s = Math.sin(t);
            return Matrix.create([
                [  c,  0,  s, 0 ],
                [  0,  1,  0, 0 ],
                [ -s,  0,  c, 0 ],
                [  0,  0,  0, 1 ]
            ]);
        };
        Matrix.Rotation4Z = function(t)
        {
            var c = Math.cos(t), s = Math.sin(t);
            return Matrix.create([
                [  c, -s,  0, 0 ],
                [  s,  c,  0, 0 ],
                [  0,  0,  1, 0 ],
                [  0,  0,  0, 1 ]
            ]);
        };

        Matrix.PerspectiveLH = function (width, height, znear, zfar)
        {
            var matrix = Matrix.Zero(4);

            matrix.elements[0][0] = (2.0 * znear) / width;
            matrix.elements[0][1] = matrix.elements[0][2] = matrix.elements[0][3] = 0.0;
            matrix.elements[1][1] = (2.0 * znear) / height;
            matrix.elements[1][0] = matrix.elements[1][2] = matrix.elements[1][3] = 0.0;
            matrix.elements[2][2] = -zfar / (znear - zfar);
            matrix.elements[2][0] = matrix.elements[2][1] = 0.0;
            matrix.elements[2][3] = 1.0;
            matrix.elements[3][0] = matrix.elements[3][1] = matrix.elements[3][3] = 0.0;
            matrix.elements[3][2] = (znear * zfar) / (znear - zfar);

            return matrix;
        };

        Matrix.PerspectiveFovLH = function (fov, aspect, znear, zfar)
        {
            var result = Matrix.Zero(4,4);
            var tan = 1.0 / (Math.tan(fov * 0.5));
            result.elements[0][0] = tan / aspect;

            result.elements[0][1] = result.elements[0][2] = result.elements[0][3] = 0.0;
            result.elements[1][1] = tan;

            result.elements[1][0] = result.elements[1][2] = result.elements[1][3] = 0.0;
            result.elements[2][0] = result.elements[2][1] = 0.0;
            result.elements[2][2] = -zfar / (znear - zfar);
            result.elements[2][3] = 1.0;
            result.elements[3][0] = result.elements[3][1] = result.elements[3][3] = 0.0;
            result.elements[3][2] = (znear * zfar) / (znear - zfar);

            return result;
        };
    }
);