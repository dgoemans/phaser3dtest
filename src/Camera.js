define(["Phaser", "Sylvester"],
    function(Phaser, Sylvester)
    {
        var Camera = function ()
        {
            this.fov = 60;
            this.projectionMatrix = Matrix.I(4);
            this.viewMatrix = Matrix.I(4);
            this.matrix = Matrix.I(4);
            this.up = Vector.create([0,1,0]);

            this.createPerspectiveMatrix();
            this.updateMatrix();
        };

        Camera.prototype.constructor = Camera;

        Camera.prototype.createPerspectiveMatrix = function()
        {
            var aspect = game.width/game.height;
            var zNear = 1;
            var zFar = 1000;
            this.makePerspective(this.fov, aspect, zNear, zFar);
            //this.projectionMatrix = Matrix.PerspectiveFovLH(this.fov, aspect, zNear, zFar);

            this.projectionMatrix.transpose();
        };

        Camera.prototype.updateMatrix = function(){
            this.matrix = this.projectionMatrix.multiply(this.viewMatrix.inverse());
        };

        Camera.prototype.update = function ()
        {

        };

        Camera.prototype.setPosition = function(vec)
        {
            this.viewMatrix.setPosition(vec);
            //this.viewMatrix.elements[0][3] = vec.elements[0];
            //this.viewMatrix.elements[1][3] = vec.elements[1];
            //this.viewMatrix.elements[2][3] = vec.elements[2];

            this.updateMatrix();
        };

        Camera.prototype.getPosition = function(vec)
        {
            return this.viewMatrix.getPosition();
        };


        Camera.prototype.makeFrustum = function ( left, right, bottom, top, near, far ) {

            var te = this.projectionMatrix.elements;
            var x = 2 * near / ( right - left );
            var y = 2 * near / ( top - bottom );

            var a = ( right + left ) / ( right - left );
            var b = ( top + bottom ) / ( top - bottom );
            var c = - ( far + near ) / ( far - near );
            var d = - 2 * far * near / ( far - near );

            te[0][0] = x;	te[1][0] = 0;	te[2][0] = a;	te[3][0] = 0;
            te[0][1] = 0;	te[1][1] = y;	te[2][1] = b;	te[3][1] = 0;
            te[0][2] = 0;	te[1][2] = 0;	te[2][2] = c;	te[3][2] = d;
            te[0][3] = 0;	te[1][3] = 0;	te[2][3] = -1;	te[3][3] = 0;
        };

        Camera.prototype.makePerspective = function ( fov, aspect, near, far ) {

            var ymax = near * Math.tan( Phaser.Math.degToRad( fov * 0.5 ) );
            var ymin = - ymax;
            var xmin = ymin * aspect;
            var xmax = ymax * aspect;

            this.makeFrustum( xmin, xmax, ymin, ymax, near, far );
        };


        Camera.prototype.lookAt = function (eye, target) {

            this.viewMatrix = Matrix.I(4);

            var x = Vector.Zero(3);
            var y = Vector.Zero(3);
            var z = Vector.Zero(3);

            var te = this.viewMatrix.elements;

            z = eye.subtract(target).toUnitVector();

            if ( z.modulus() === 0 ) {
                z.elements[2] = 1;
            }

            x = this.up.cross(z).toUnitVector();

            if ( x.modulus() === 0 ) {
                z.elements[0] += 0.0001;
                x = this.up.cross(z).toUnitVector();
            }

            y = z.cross(x);

            te[0][0] = x.elements[0]; te[1][0] = y.elements[0]; te[2][0] = z.elements[0];
            te[0][1] = x.elements[1]; te[1][1] = y.elements[1]; te[2][1] = z.elements[1];
            te[0][2] = x.elements[2]; te[1][2] = y.elements[2]; te[2][2] = z.elements[2];

            this.viewMatrix = this.viewMatrix.transpose();

            this.setPosition(eye);
        };


        Camera.getInstance = function() {
            if(!Camera._instance)
                Camera._instance = new Camera();
            return Camera._instance;
        };

        return Camera;
    });


