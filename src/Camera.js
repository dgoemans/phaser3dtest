define(["Phaser", "glMatrix"],
    function(Phaser, GL)
    {
        var Camera = function ()
        {
            this.fov = 30;
            this.projectionMatrix = GL.mat4.create();
            this.viewMatrix = GL.mat4.create();
            this.up = GL.vec3.fromValues(0,1,0);

            this.position = GL.vec3.create();
            this.lookat = GL.vec3.create();

            this.createPerspectiveMatrix();
        };

        Camera.prototype.constructor = Camera;

        Camera.prototype.createPerspectiveMatrix = function()
        {
            var aspect = game.width/game.height;
            var zNear = 1;
            var zFar = 1000;
            GL.mat4.perspective(this.projectionMatrix, this.fov, aspect, zNear, zFar);
            //GL.mat4.ortho(this.projectionMatrix, -1, 1, 1, -1, -1, 1);
        };

        Camera.prototype.update = function ()
        {

        };

        Camera.prototype.updateMatrix = function()
        {
            GL.mat4.lookAt(this.viewMatrix, this.position, this.lookat, this.up);
            //GL.mat4.transpose(this.projectionMatrix,this.projectionMatrix);
            //GL.mat4.invert(this.viewMatrix,this.viewMatrix);
        };

        Camera.prototype.setPosition = function(vec)
        {
            this.position = GL.vec3.clone(vec);
            this.updateMatrix();
        };

        Camera.prototype.getPosition = function()
        {
            return this.position;
        };


        Camera.prototype.lookAt = function (eye, target)
        {
            this.position = GL.vec3.clone(eye);
            this.lookat = GL.vec3.clone(target);
            this.updateMatrix();
        };


        Camera.getInstance = function() {
            if(!Camera._instance)
                Camera._instance = new Camera();
            return Camera._instance;
        };

        return Camera;
    });


