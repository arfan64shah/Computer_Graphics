function main(){
    var canvas = document.getElementById("example");

    if(!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return false;
    }

    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(255, 0, 0, 0.9)';
    ctx.fillRect(190, 190, 20, 20);
}