define(["Phaser"],
    function(Phaser)
    {
        var Mode7Floor = function()
        {

        }

        Mode7Floor.constructor = Mode7Floor;

        Mode7Floor.prototype.draw = function()
        {

            var stage_index, ground_index, horizonY,
                ty, xTilt, e, d, c, zf,
                xr, yr, yd, xd, yp, xp,
                ca, sa, can, san;

            horizonY = stageHeight/2;

            ty=2;

            //

            var groundFactor=1, xFac=1.5, yFac=1;

            ca=Math.cos(angle)*48*groundFactor*xFac;
            sa=Math.sin(angle)*48*groundFactor*xFac;
            can=Math.cos(angle+Math.PI/2)*16*groundFactor*yFac;
            san=Math.sin(angle+Math.PI/2)*16*groundFactor*yFac;

            //

            var bottom=stageHeight;

            angle += (mouseX - window.innerWidth/2) *0.0001;

            var s = -(mouseY-380)/380;
            s=s*16*2;

            locX -= Math.sin(-angle+Math.PI)*s;
            locY -= Math.cos(-angle+Math.PI)*s;

            if (locY<100) locY=100;
            if (locY>2880-100) locY=2880-100;

            //

            var cax, sax, yn, xn, rx, ry;

            var tilt=0;

            //

            var lev = Math.floor ( stageWidth /3 );

            for (var x=0;x<lev;x++) {

                rx = x * 3 ;

                xr = -((x/lev)-0.5);

                cax = (ca*xr)+can;
                sax = (sa*xr)+san;

                xTilt = tilt * xr;

                xTilt -= horizonY;

                //bottom = stageHeight;

                for (var y=200;y>0;y--) {

                    zf=200/y;

                    xd = Math.floor(locX+cax*zf);
                    yd = Math.floor(locY+sax*zf);

                    // d=0;  //groundDataBD.getPixel(xd,yd);

                    ry=(y*0.98)-xTilt;//-(d/zf)

                    //if (ry<bottom) {

                    //c = ground_data[ (xd + yd * 2880 )*4];

                    //if (c!=0) {

                    //r.height = bottom-r.y;
                    //stageBD.fillRect(r,c);

                    stage_index = (rx + Math.floor(ry) * stageWidth ) * 4;

                    ground_index = (xd + yd * ground_canvas.width) * 4;

                    stage_data[ stage_index ] =  ground_data[ ground_index ];
                    stage_data[ stage_index+1 ] = ground_data[ ground_index+1 ];
                    stage_data[ stage_index+2 ] = ground_data[ ground_index+2 ];

                    //}

                    //bottom=ry;

                    //}

                }

            }

            stage_context.putImageData( stage_image, 0, 0 );
        };

        //Mode7Floor.prototype.draw = function(e, t)
        //{
        //    var s = this._drop / (2 * this._world3d.camera.z),
        //        i = s * this._world3d.cs,
        //        n = s * this._world3d.sn,
        //        r = n * this._world3d.camera.x,
        //        a = n * this._world3d.camera.y,
        //        o = i * this._world3d.camera.x,
        //        l = i * this._world3d.camera.y;
        //
        //    i *= 1.40625;
        //    n *= 1.40625;
        //
        //    this._matrix.identity();
        //
        //    this._matrix.a = -n;
        //    this._matrix.b = -i, this._matrix.c = i, this._matrix.d = -n;
        //
        //    this._matrix.tx = .5 * this._world3d.width - l + r;
        //    this._matrix.ty = this._world3d.height + this._world3d.camera.fov + a + o;
        //
        //    e.beginBitmapFill(t.image, "repeat", this._matrix);
        //
        //    e.rect(0, this._y, this._width, this._height);
        //}
    }
);