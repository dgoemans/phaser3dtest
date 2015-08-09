define(["glMatrix"],
    function(GL)
    {
        GL.mat4.setTranslation = function(out, v){
            out[12] = v[0];
            out[13] = v[1];
            out[14] = v[2];
        };

        GL.mat4.getTranslation = function(mat){
            return GL.vec3.fromValues(mat[12], mat[13], mat[14]);
        }
    }
);