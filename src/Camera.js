define(["Phaser", "glMatrix"],
    function(Phaser, GL)
    {
        var Camera = function ()
        {
            this.fov = 60;
            this.projectionMatrix = GL.mat4.create();
            this.viewMatrix = GL.mat4.create();
            this.up = GL.vec3.fromValues(0,1,0);

            this.createPerspectiveMatrix();
        };

        Camera.prototype.constructor = Camera;

        Camera.prototype.createPerspectiveMatrix = function()
        {
            var aspect = game.width/game.height;
            var zNear = 1;
            var zFar = 1000;
            GL.mat4.perspective(this.projectionMatrix, this.fov, aspect, zNear, zFar);
        };

        Camera.prototype.update = function ()
        {
            //GL.mat4.transpose(this.projectionMatrix,this.projectionMatrix);
        };

        Camera.prototype.updateMatrix = function()
        {
            //GL.mat4.invert(this.viewMatrix,this.viewMatrix);
        };

        Camera.prototype.setPosition = function(vec)
        {
            GL.mat4.setTranslation(this.viewMatrix, vec);
            this.updateMatrix();
        };

        Camera.prototype.getPosition = function()
        {
            return GL.mat4.getTranslation(this.viewMatrix);
        };


        Camera.prototype.lookAt = function (eye, target) {

            GL.mat4.lookAt(this.viewMatrix, eye, target, this.up);
            this.updateMatrix();
        };


        Camera.getInstance = function() {
            if(!Camera._instance)
                Camera._instance = new Camera();
            return Camera._instance;
        };

        return Camera;
    });


