$(function () {
    function ontouch(el, callback) {


        var touchsurface = el,
                dir,
                swipeType,
                startX,
                startY,
                distX,
                distY,
                threshold = 150, //required min distance traveled to be considered swipe
                restraint = 100, // maximum distance allowed at the same time in perpendicular direction
                allowedTime = 500, // maximum time allowed to travel that distance
                elapsedTime,
                startTime,
                handletouch = callback || function (evt, dir, phase, swipetype, distance) {}

        touchsurface.addEventListener('touchstart', function (e) {
            var touchobj = e.changedTouches[0]
            dir = 'none'
            swipeType = 'none'
            dist = 0
            startX = touchobj.pageX
            startY = touchobj.pageY
            startTime = new Date().getTime() // record time when finger first makes contact with surface
            handletouch(e, 'none', 'start', swipeType, 0) // fire callback function with params dir="none", phase="start", swipetype="none" etc
            e.preventDefault()

        }, false)

        touchsurface.addEventListener('touchmove', function (e) {
            var touchobj = e.changedTouches[0]
            distX = touchobj.pageX - startX // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.pageY - startY // get vertical dist traveled by finger while in contact with surface
            if (Math.abs(distX) > Math.abs(distY)) { // if distance traveled horizontally is greater than vertically, consider this a horizontal movement
                dir = (distX < 0) ? 'left' : 'right'
                handletouch(e, dir, 'move', swipeType, distX) // fire callback function with params dir="left|right", phase="move", swipetype="none" etc
            } else { // else consider this a vertical movement
                dir = (distY < 0) ? 'up' : 'down'
                handletouch(e, dir, 'move', swipeType, distY) // fire callback function with params dir="up|down", phase="move", swipetype="none" etc
            }
            e.preventDefault() // prevent scrolling when inside DIV
        }, false)

        touchsurface.addEventListener('touchend', function (e) {
            var touchobj = e.changedTouches[0]
            elapsedTime = new Date().getTime() - startTime // get time elapsed
            if (elapsedTime <= allowedTime) { // first condition for awipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
                    swipeType = dir // set swipeType to either "left" or "right"
                } else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
                    swipeType = dir // set swipeType to either "top" or "down"
                }
            }
            // Fire callback function with params dir="left|right|up|down", phase="end", swipetype=dir etc:
            handletouch(e, dir, 'end', swipeType, (dir == 'left' || dir == 'right') ? distX : distY)
            e.preventDefault()
            $(this).css('left', '0px');
            $(this).css('opacity', '1');
        }, false)
    }
    window.addEventListener('load', function () {
        var el = document.getElementById('alert__temp')
        ontouch(el, function (evt, dir, phase, swipetype, distance) {
            //var touchreport = ''
            /*touchreport += '<b>Dir:</b> ' + dir + '<br />'
             touchreport += '<b>Phase:</b> ' + phase + '<br />'
             touchreport += '<b>Swipe Type:</b> ' + swipetype + '<br />'
             touchreport += '<b>Distance:</b> ' + distance + '<br />'*/
            //el.innerHTML = touchreport
            $(el).css('left', distance);
            if (dir === 'left' && distance < -350) {
                $(el).css('display', 'none');
                $('#status__temp').removeClass('alert');
                $('#status__temp #status__icon img').attr('src', 'images/icons/temp.png');
                $('.change__current').removeClass('alert');
            }
            if (dir === 'right' && distance > 350) {
                $(el).css('display', 'none');
                $('#status__temp').removeClass('alert');
                $('#status__temp #status__icon img').attr('src', 'images/icons/temp.png');
                $('.change__current').removeClass('alert');
            }
        })
    }, false)
    window.addEventListener('load', function () {
        var el = document.getElementById('alert__volt')
        ontouch(el, function (evt, dir, phase, swipetype, distance) {
            $(el).css('left', distance);
            if (dir === 'left' && distance < -350) {
                $(el).css('display', 'none');
                $('#status__volt').removeClass('alert');
                $('#status__volt #status__icon img').attr('src', 'images/icons/voltage.png');
                $('.change__current').removeClass('alert');
            }
            if (dir === 'right' && distance > 350) {
                $(el).css('display', 'none');
                $('#status__volt').removeClass('alert');
                $('#status__volt #status__icon img').attr('src', 'images/icons/voltage.png');
                $('.change__current').removeClass('alert');
            }
        })
    }, false)
    window.addEventListener('load', function () {
        var el = document.getElementById('alert__door')
        ontouch(el, function (evt, dir, phase, swipetype, distance) {
            $(el).css('left', distance);
            if (dir === 'left' && distance < -350) {
                $(el).css('display', 'none');
                $('#status__door').removeClass('alert');
                $('#status__door #status__icon img').attr('src', 'images/icons/door.png');
                $('.change__current').removeClass('alert');
            }
            if (dir === 'right' && distance > 350) {
                $(el).css('display', 'none');
                $('#status__door').removeClass('alert');
                $('#status__door #status__icon img').attr('src', 'images/icons/door.png');
                $('.change__current').removeClass('alert');
            }
        })
    }, false)
    window.addEventListener('load', function () {
        var el = document.getElementById('alert__smoke')
        ontouch(el, function (evt, dir, phase, swipetype, distance) {
            $(el).css('left', distance);
            if (dir === 'left' && distance < -350) {
                $(el).css('display', 'none');
                $('#status__smoke').removeClass('alert');
                $('#status__smoke #status__icon img').attr('src', 'images/icons/smoke.png');
                $('.change__current').removeClass('alert');
            }
            if (dir === 'right' && distance > 350) {
                $(el).css('display', 'none');
                $('#status__smoke').removeClass('alert');
                $('#status__smoke #status__icon img').attr('src', 'images/icons/smoke.png');
                $('.change__current').removeClass('alert');
            }
        })
    }, false)
    window.addEventListener('load', function () {
        var el = document.getElementById('alert__water')
        ontouch(el, function (evt, dir, phase, swipetype, distance) {
            $(el).css('left', distance);
            if (dir === 'left' && distance < -350) {
                $(el).css('display', 'none');
                $('#status__water').removeClass('alert');
                $('#status__water #status__icon img').attr('src', 'images/icons/water.png');
                $('.change__current').removeClass('alert');
            }
            if (dir === 'right' && distance > 350) {
                $(el).css('display', 'none');
            }
        })
    }, false)
});
