/**
 * Created by David on 29-Mar-15.
 */
requirejs.config({
    baseUrl: 'src',
    paths: {
        Phaser: '../lib/phaser',
        Sylvester: '../lib/sylvester'
    }
});


Array.prototype.clone = function() {
    return this.slice(0);
};

require(["Sylvester", "sylvester_tweaks"]);

require(["Phaser",
        "Camera",
        "Model"],
function(Phaser, Camera, Model)
{
    var gameElt = document.getElementById('game');
    game = new Phaser.Game(gameElt.clientWidth, gameElt.clientHeight, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });
    var cursors = null;
    var camera = null;
    var model = null;

    var leftDown = false;
    var rightDown = false;

    var cameraAngle = 0;
    var cameraDist = 100;

    var models = [];
    var decorCubes = [];

    var cameraPos;

    function preload()
    {
        game.load.image('car', 'assets/car.png');
        game.load.image('tyre', 'assets/tyre.png');
        game.load.image('grass', 'assets/grass.png');
        game.load.image('road', 'assets/road.png');
        game.load.image('straight', 'assets/straight.png');
        game.load.image('corner', 'assets/corner.png');
        game.load.image('crate', 'assets/crate.png');
        game.load.image('smoke', 'assets/smoke.png');
    }

    function create()
    {
        //var worldWidth = 500000;
        //var worldHeight = 500000;
        game.world.setBounds(-game.width/2, -game.height/2, game.width/2, game.height/2);

        game.stage.backgroundColor = '#99aaff';

        cursors = game.input.keyboard.createCursorKeys();

        cameraPos = Vector.create([0,0,120]);

        camera = Camera.getInstance();

        //game.add.image(0,0,"car");

        var vertices = [];
        vertices.push(Vector.create([10, 10, -10]));
        vertices.push(Vector.create([10, 10, 10]));
        vertices.push(Vector.create([10, -10, 10]));
        vertices.push(Vector.create([10, -10, -10]));

        vertices.push(Vector.create([-10, 10, -10]));
        vertices.push(Vector.create([-10, -10, -10]));
        vertices.push(Vector.create([10, -10, -10]));
        vertices.push(Vector.create([10, 10, -10]));

        vertices.push(Vector.create([-10, -10, 10]));
        vertices.push(Vector.create([-10, -10, -10]));
        vertices.push(Vector.create([10, -10, -10]));
        vertices.push(Vector.create([10, -10, 10]));

        vertices.push(Vector.create([-10, 10, 10]));
        vertices.push(Vector.create([-10, 10, -10]));
        vertices.push(Vector.create([10, 10, -10]));
        vertices.push(Vector.create([10, 10, 10]));

        vertices.push(Vector.create([-10, 10, -10]));
        vertices.push(Vector.create([-10, 10, 10]));
        vertices.push(Vector.create([-10, -10, 10]));
        vertices.push(Vector.create([-10, -10, -10]));

        vertices.push(Vector.create([-10, 10, 10]));
        vertices.push(Vector.create([-10, -10, 10]));
        vertices.push(Vector.create([10, -10, 10]));
        vertices.push(Vector.create([10, 10, 10]));

        model = new Model(vertices, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23], 4);
        model.setPosition(Vector.create([35,0,0]));
        model.baseColor = [255, 0, 0];
        models.push(model);
        decorCubes.push(model);



        var vertices = [];
        vertices.push(Vector.create([10, 10, -10])); // R T B
        vertices.push(Vector.create([10, 10, 10]));  // R T F
        vertices.push(Vector.create([10, -10, 10])); // R B F
        vertices.push(Vector.create([10, -10, -10]));// R B B
        vertices.push(Vector.create([-10, 10, -10])); // L T B
        vertices.push(Vector.create([-10, 10, 10]));  // L T F
        vertices.push(Vector.create([-10, -10, 10])); // L B F
        vertices.push(Vector.create([-10, -10, -10]));// L B B

        model = new Model(vertices, [0,1,2,3, 1,2,6,5, 0,3,7,4, 4,5,6,7, 0,1,5,4, 2,3,7,6], 4);
        model.setPosition(Vector.create([-35,0,0]));
        model.baseColor = [0, 0, 255];
        models.push(model);
        decorCubes.push(model);


        var platLength = 4000;
        var wallHeight = 6;
        var platWidth = 50;
        var wallEdge = 58;

        var vertices = [];
        vertices.push(Vector.create([platWidth, 1, -platLength])); // R T B
        vertices.push(Vector.create([platWidth, 1, 1]));  // R T F
        vertices.push(Vector.create([platWidth, -1, 1])); // R B F
        vertices.push(Vector.create([platWidth, -1, -platLength]));// R B B
        vertices.push(Vector.create([-platWidth, 1, -platLength])); // L T B
        vertices.push(Vector.create([-platWidth, 1, 1]));  // L T F
        vertices.push(Vector.create([-platWidth, -1, 1])); // L B F
        vertices.push(Vector.create([-platWidth, -1, -platLength]));// L B B

        model = new Model(vertices, [0,1,2,3, 1,2,6,5, 0,3,7,4, 4,5,6,7, 0,1,5,4, 2,3,7,6], 4);
        model.setPosition(Vector.create([0,-50,0]));
        model.baseColor = [255, 255, 255];
        models.push(model);

        var vertices = [];
        vertices.push(Vector.create([wallEdge, wallHeight, -platLength])); // R T B
        vertices.push(Vector.create([wallEdge, wallHeight, 1]));  // R T F
        vertices.push(Vector.create([wallEdge, -1, 1])); // R B F
        vertices.push(Vector.create([wallEdge, -1, -platLength]));// R B B
        vertices.push(Vector.create([platWidth, wallHeight, -platLength])); // L T B
        vertices.push(Vector.create([platWidth, wallHeight, 1]));  // L T F
        vertices.push(Vector.create([platWidth, -1, 1])); // L B F
        vertices.push(Vector.create([platWidth, -1, -platLength]));// L B B

        model = new Model(vertices, [0,1,2,3, 1,2,6,5, 0,3,7,4, 4,5,6,7, 0,1,5,4, 2,3,7,6], 4);
        model.setPosition(Vector.create([0,-50,0]));
        model.baseColor = [255, 255, 255];
        models.push(model);

        var vertices = [];
        vertices.push(Vector.create([-wallEdge, wallHeight, -platLength])); // R T B
        vertices.push(Vector.create([-wallEdge, wallHeight, 1]));  // R T F
        vertices.push(Vector.create([-wallEdge, -1, 1])); // R B F
        vertices.push(Vector.create([-wallEdge, -1, -platLength]));// R B B
        vertices.push(Vector.create([-platWidth, wallHeight, -platLength])); // L T B
        vertices.push(Vector.create([-platWidth, wallHeight, 1]));  // L T F
        vertices.push(Vector.create([-platWidth, -1, 1])); // L B F
        vertices.push(Vector.create([-platWidth, -1, -platLength]));// L B B

        model = new Model(vertices, [0,1,2,3, 1,2,6,5, 0,3,7,4, 4,5,6,7, 0,1,5,4, 2,3,7,6], 4);
        model.setPosition(Vector.create([0,-50,0]));
        model.baseColor = [255, 255, 255];
        models.push(model);

        /*models.forEach(function(model){
            model.setRotation(Vector.create([Math.PI/4,Math.PI/4,0]));
        });*/

        /*var graphics = game.add.graphics(0,0);
        graphics.beginFill(0x333333);

        graphics.moveTo(5,-5);
        graphics.lineTo(-5,-5);
        graphics.lineTo(-5,5);
        graphics.lineTo(5,5);
        graphics.lineTo(5,-5);

        graphics.endFill();*/

        //game.add.image(0,0,"crate");
    }

    function update()
    {
        var movement = false;
        // Camera schemes:
        // Movement - walk and strafe
        // Rotation - rotate around the origin
        if(movement)
        {
            var x = cameraPos.elements[0], y = cameraPos.elements[1], z = cameraPos.elements[2];
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
                cameraDist -= 0.5;
            }
            if(cursors.down.isDown)
            {
                z += 1.5;
            }

            cameraPos.elements[0] = x;
            cameraPos.elements[1] = y;
            cameraPos.elements[2] = z;
            camera.lookAt(cameraPos, Vector.create([x,y,z-100]));

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
                cameraDist += 1.5;
            }
            else if(cursors.down.isDown)
            {
                cameraDist -= 1.5;
            }


            var x = Math.cos(cameraAngle)*cameraDist;
            var y = Math.sin(cameraAngle)*cameraDist;

            cameraPos.elements[0] = y;
            cameraPos.elements[1] = 0;
            cameraPos.elements[2] = x;

            camera.lookAt(cameraPos, Vector.create([0,0,0]));

        }



        models.forEach(function(model){
            model.update();
        });

        decorCubes.forEach(function(model){
            var t = game.time.elapsed/1000;
            model.setRotation(Vector.create([t/2,t,t/4]));
        });


        camera.update();
    }

    function render()
    {
        models.sort(function(a,b){
            var aPos = a.getPosition();
            var bPos = b.getPosition();
            var camPos = Camera.getInstance().getPosition();

            var aDist = aPos.distanceFrom(camPos);
            var bDist = bPos.distanceFrom(camPos);

            return bDist - aDist;
        });

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

