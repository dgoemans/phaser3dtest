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
    "RoadSection",
    "glMatrix"],
function(Phaser, Camera, Model, Geometry, Debug, RoadSection, GL)
{
    Phaser.Plugin.Debug = Debug;
    var gameElt = document.getElementById('game');
    game = new Phaser.Game(gameElt.clientWidth, gameElt.clientHeight, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render });

    var cubesOn = true;
    var wallsOn = true;
    var floorOn = true;

    var cameraPos = GL.vec3.fromValues(0,20,0);
    var lookAtPos = GL.vec3.fromValues(0,0,0);

    var cursors = null;
    var camera = null;

    var cameraAngle = 0;
    var cameraDist = 100;

    var models = [];
    var decorCubes = [];

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
        game.load.image('up', 'assets/up_arrow.png');
        game.load.image('down', 'assets/down_arrow.png');
        game.load.image('stop', 'assets/stop.png');

    }

    function create()
    {
        game.world.setBounds(-game.width/2, -game.height/2, game.width/2, game.height/2);

        game.stage.backgroundColor = '#99aaff';

        cursors = game.input.keyboard.createCursorKeys();


        camera = Camera.getInstance();

        if(isMobileOrTablet())
        {
            game.add.button(-game.width/2, -200, 'up', forward, this);
            game.add.button(-game.width/2, 0, 'down', back, this);
            game.add.button(-game.width/2, 200, 'stop', stopMoving, this);
        }
    }


    var autoMove = true;
    var direction = -1;

    function forward() {
        direction = -1;
        autoMove = true;
    };

    function stopMoving() {
        autoMove = false;
    };

    function back() {
        direction = 1;
        autoMove = true;
    };

    function update()
    {
        var zSpeed = 10;

        var x = lookAtPos[0], y = lookAtPos[1], z = lookAtPos[2];

        if(cursors.up.isDown)
        {
            z -= zSpeed;
        }
        if(cursors.down.isDown)
        {
            z += zSpeed;
        }
        if(autoMove)
        {
            z += zSpeed * direction;
        }

        if(cursors.right.isDown)
        {
            cameraAngle -= 0.03;
        }
        else if(cursors.left.isDown)
        {
            cameraAngle += 0.03;
        }

        var cameraVariance = Math.PI/8;
        cameraAngle = Math.min(Math.max(cameraAngle,-cameraVariance),cameraVariance);

        var offX = Math.sin(cameraAngle)*cameraDist;
        var offY = Math.cos(cameraAngle)*cameraDist;

        GL.vec3.set(cameraPos, x + offX, y + 25, z + offY);
        GL.vec3.set(lookAtPos, x, y, z);


        camera.lookAt(cameraPos, lookAtPos);

        models.forEach(function(model){
            model.update();
        });

        decorCubes.forEach(function(model){
            var t = game.time.elapsed/1000;
            model.rotate(GL.vec3.fromValues(t/2,t,t/4));

            //t = game.time.totalElapsedSeconds();
            //model.setPosition(GL.vec3.fromValues(Math.sin(t)*10,Math.sin(t)*10,Math.sin(t)*10));
        });

        // While the camera is within ViewDist sections of the end
        var viewDist = isMobileOrTablet() ? 5 : 20;

        while(models.length === 0 || Math.abs(cameraPos[2] - models[models.length-1].z) < viewDist*RoadSection.segLength )
        {
            generateSegment();
            if(cameraPos[2] < models[0].z)
            {
                var model = models.shift();
                model.destroy();
            }
        }

        camera.update();
    }

    var currentSegY = 0;
    var created = 0;

    function generateSegment()
    {
        var gap = Math.random() < 0.1;
        created++;
        var last = models.length ? models[models.length-1] : null;
        var z = (last ? last.z - RoadSection.segLength : 0);
        if(gap)
            z -= 100;
        var jitter = Math.random() * 5;
        var oldSegY = currentSegY;
        currentSegY = (0.3*Math.sin(created/10*Math.PI*2) + 0.7 * Math.random())*15;
        models.push(new RoadSection(modelsGroup,jitter,oldSegY,currentSegY, z));
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

