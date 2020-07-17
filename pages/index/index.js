const {ipcRenderer} = require('electron');

class Surface {
    constructor() {
        const canvas = document.querySelector("#canvas");
        const ratio = window.devicePixelRatio;
        
        window.onresize = function() {
            const canvas_width = window.innerWidth / 100 * 98;
            const canvas_height = window.innerHeight / 100 * 92; 
            canvas.style.width = canvas_width + 'px';
            canvas.style.height = canvas_height + 'px';
            canvas.width = canvas_width * ratio;
            canvas.height = canvas_height * ratio;
            console.log(canvas_width, canvas_height);
        }
        console.log(ratio);
        let ctx = canvas.getContext("2d");

        function getPoint(e) {
            // const rect = canvas.getBoundingClientRect();
            // let e_x = e.clientX - rect.left;
            // let e_y = e.clientY - rect.top;
            // return { x: e_x * ratio, y: e_y * ratio };
            return { x: e.clientX * ratio, y: e.clientY * ratio };
        }
        let point = null;
        let enableDrawWidget = false;
        function drawLineTo(new_point) {
            ctx.lineWidth = 5 * ratio;
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(new_point.x, new_point.y);
            ctx.stroke();
            point = new_point;
        }

        ipcRenderer.on("my_point_move", function(e,vector) {
            ctx.lineWidth = 5 * ratio;
            ctx.beginPath();
            let i = 0;
            while(i < vector.length) {
                ctx.moveTo(vector[i], vector[i+1]);
                ctx.lineTo(vector[i+2], vector[i+3]);
                i += 2;
            }
            ctx.stroke();
        })

        ipcRenderer.on("stop_canvas_draw", function(event, is_true) {
            enableDrawWidget = is_true;
        });


        /***********************************************/
        // add event listener
        canvas.addEventListener("pointerdown", (e) => {
            if(enableDrawWidget)
                return;
            console.log("down")
            point = getPoint(e);
        });

        canvas.addEventListener("pointermove", (e) => {
            if(enableDrawWidget)
                return;
            if (!point) return;
            let e_temp = getPoint(e);
            if (e_temp) drawLineTo(e_temp);

        });
        canvas.addEventListener("pointerup", (e) => {
            if(enableDrawWidget)
                return;
            point = null;
        });

        const open_button = document.querySelector("#button1");
        const close_button = document.querySelector("#button2");
        open_button.onclick = (event) => {
            ipcRenderer.send("switch-draw-widget", true);
        }
        close_button.onclick = (event) => {
            ipcRenderer.send("switch-draw-widget", false);
        }
    }
}

const surface1 = new Surface();
