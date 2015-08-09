/**
 * Created by David on 29-Mar-15.
 */
require.config({
    baseUrl: 'src',
    paths: {
        Phaser: '../lib/phaser',
        Debug: '../lib/phaser-debug',
        glMatrix: '../lib/gl-matrix-min'
    },
    shim: {
        'Phaser' : {
            exports: 'Phaser'
        },
        'Debug' : {
            deps: ['Phaser'],
            exports: 'Debug'
        }/*,
        'glMatrix' : {
            exports: 'glMatrix'
        }*/
    }
});


Array.prototype.clone = function() {
    return this.slice(0);
};

require(["glMatrix", "gl-matrix-tweaks"]);

require(["Phaser",
    "Camera",
    "Model",
    "Geometry",
    "Debug",
    "glMatrix"],
function(Phaser, Camera, Model, Geometry, Debug, GL)
{
    Phaser.Plugin.Debug = Debug;
    var gameElt = document.getElementById('game');
    game = new Phaser.Game(gameElt.clientWidth, gameElt.clientHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

    var cubesOn = false;
    var wallsOn = false;
    var floorOn = true;

    var segments = 1;
    var segLength = 50;
    var wallSize = 3;
    var runwayWidth = 10;
    var runwayY = 0;

    var cursors = null;
    var camera = null;
    var model = null;

    var cameraAngle = 0;
    var cameraDist = 100;

    var models = [];
    var decorCubes = [];

    var cameraPos;
    var lookAtPos;

    var modelsGroup = null;

    function preload()
    {
        game.add.plugin(Phaser.Plugin.Debug);
        modelsGroup = game.add.group();

        game.load.image('car', 'assets/car.png');
        game.load.image('tyre', 'assets/tyre.png');
        game.load.image('grass', 'assets/grass.png');
        game.load.image('road', 'assets/road.png');
        game.load.image('straight', 'assets/straight.png');
        game.load.image('corner', 'assets/corner.png');
        game.load.image('crate', 'assets/crate.png');
        game.load.image('smoke', 'assets/smoke.png');
        game.load.image('foot', 'assets/foot.png');
        game.load.image('floor', 'assets/floor.png');
    }

    function create()
    {
        game.world.setBounds(-game.width/2, -game.height/2, game.width/2, game.height/2);

        game.stage.backgroundColor = '#99aaff';

        cursors = game.input.keyboard.createCursorKeys();

        cameraPos = GL.vec3.fromValues(0,20,0);
        lookAtPos = GL.vec3.fromValues(0,20,-10);

        camera = Camera.getInstance();

        if(cubesOn || wallsOn)
        {
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
        }


        if(cubesOn)
        {
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

            model = new Model(modelsGroup, vertices, indices, uvs, "road");
            model.setPosition(GL.vec3.fromValues(50,10,-500));
            models.push(model);
            decorCubes.push(model);
        }

        if(wallsOn)
        {
            vertices = [];
            vertices.push(GL.vec3.fromValues(-wallSize, -wallSize, segLength/2));
            vertices.push(GL.vec3.fromValues(wallSize, -wallSize, segLength/2));
            vertices.push(GL.vec3.fromValues(wallSize, wallSize, segLength/2));
            vertices.push(GL.vec3.fromValues(-wallSize, wallSize, segLength/2));
            vertices.push(GL.vec3.fromValues(-wallSize, -wallSize, -segLength/2));
            vertices.push(GL.vec3.fromValues(wallSize, -wallSize, -segLength/2));
            vertices.push(GL.vec3.fromValues(wallSize, wallSize, -segLength/2));
            vertices.push(GL.vec3.fromValues(-wallSize, wallSize, -segLength/2));

            for(var i=0; i<segments; i++)
            {
                model = new Model(modelsGroup, vertices, indices, uvs, "floor");
                model.setPosition(GL.vec3.fromValues(-runwayWidth - wallSize,runwayY + wallSize,-segLength*i - segLength/2));
                models.push(model);
            }

            for(var i=0; i<segments; i++)
            {
                model = new Model(modelsGroup, vertices, indices, uvs, "floor");
                model.setPosition(GL.vec3.fromValues(runwayWidth + wallSize,runwayY + wallSize,-segLength*i - segLength/2));
                models.push(model);
            }

        }

        if(floorOn)
        {
            var vertices = [];
            vertices.push(GL.vec3.fromValues(-runwayWidth, 0, -segLength/2)); // R T B
            vertices.push(GL.vec3.fromValues(runwayWidth, 0, -segLength/2));  // R T F
            vertices.push(GL.vec3.fromValues(runwayWidth, 0, segLength/2)); // R B F
            vertices.push(GL.vec3.fromValues(-runwayWidth, 0, segLength/2));// R B B

            var uvs = [];
            uvs.push(GL.vec2.fromValues(0, 1));
            uvs.push(GL.vec2.fromValues(1, 1));
            uvs.push(GL.vec2.fromValues(1, 0));

            uvs.push(GL.vec2.fromValues(0, 1));
            uvs.push(GL.vec2.fromValues(1, 0));
            uvs.push(GL.vec2.fromValues(0, 0));

            for(var i=0; i<segments; i++)
            {
                model = new Model(modelsGroup, vertices, [0,1,2,0,2,3], uvs, "floor");
                model.setPosition(GL.vec3.fromValues(0,runwayY,segLength*i - segLength/2));
                models.push(model);
            }
        }


    }

    function update()
    {
        var movement = true;
        // Camera schemes:
        // Movement - walk and strafe
        // Rotation - rotate around the origin
        if(movement)
        {
            var x = cameraPos[0], y = cameraPos[1], z = cameraPos[2];
            if(cursors.right.isDown)
            {
                x += 0.5;
            }
            if(cursors.left.isDown)
            {
                x -= 0.5;
            }
            if(cursors.up.isDown)
            {
                z -= 1.5;
            }
            if(cursors.down.isDown)
            {
                z += 1.5;
            }

            GL.vec3.set(cameraPos, x,y,z);
            GL.vec3.set(lookAtPos, x, 0, z-20);

            camera.lookAt(cameraPos, lookAtPos);
            //camera.setPosition(cameraPos);

        }
        else
        {
            if(cursors.right.isDown)
            {
                cameraAngle += 0.03;
            }
            else if(cursors.left.isDown)
            {
                cameraAngle -= 0.03;
            }
            else if(cursors.up.isDown)
            {
                cameraDist -= 1.5;
            }
            else if(cursors.down.isDown)
            {
                cameraDist += 1.5;
            }


            var x = Math.cos(cameraAngle)*cameraDist;
            var y = Math.sin(cameraAngle)*cameraDist;

            cameraPos[0] = y;
            cameraPos[1] = 20;
            cameraPos[2] = x;

            //camera.setPosition(cameraPos);
            camera.lookAt(cameraPos, GL.vec3.fromValues(0,0,0));

        }

        models.forEach(function(model){
            model.update();
        });

        decorCubes.forEach(function(model){
            var t = game.time.elapsed/1000;
            model.rotate(GL.vec3.fromValues(t/2,t,t/4));

            //t = game.time.totalElapsedSeconds();
            //model.setPosition(GL.vec3.fromValues(Math.sin(t)*10,Math.sin(t)*10,Math.sin(t)*10));
        });


        camera.update();
    }

    function render()
    {
        modelsGroup.sort('z', Phaser.Group.SORT_DESCENDING);

        models.forEach(function(model){
            model.render();
        });
    }

    function isMobileOrTablet() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }

});

