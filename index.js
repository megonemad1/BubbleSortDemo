var sort_step = (lst) => {
    for (var i = 0; i < lst.length - 1; i++) {
        if (lst[i] < lst[i + 1]) {
            tmp = lst[i];
            lst[i] = lst[i + 1];
            lst[i + 1] = tmp;
            return lst;
        }
    }
    return lst;
}
var score = 0;
var animating = false;
$('#container').on('click', '.move', function () {
    const hilightclass = "hilight";
    if (!animating) {
        toggleClass($(this), hilightclass);
        var selected = $(`#container .${hilightclass}`);
        if (selected.length >= 2) {
            animating = true;
            let div1 = $(selected[0]);
            let div2 = $(selected[1]);
            const expected_order = sort_step(getCurrentValues()).join();
            div1.removeClass(hilightclass);
            div2.removeClass(hilightclass);
            swap_divs(div1, div2, 200, () => {
                const current_order = getCurrentValues().join();
                if (expected_order == current_order)
                    score++;
                else
                    score--;
                $('#score').text(score);
                animating = false;
            });
        }
    }
})

function getCurrentValues() {
    return $('#container .move').map((i, item) => parseInt($(item).text().match(/\d+/)[0])).get();
}

function toggleClass(node, c) {
    if (node.hasClass(c))
        node.removeClass(c);
    else
        node.addClass(c);
}
function swapDivInHeierachy(div1, div2) {

    tdiv1 = div1.clone();
    tdiv2 = div2.clone();
    div1.replaceWith(tdiv2);
    div2.replaceWith(tdiv1);
}
function swap_divs(div1, div2, t, cb) {
    distancex = div1.offset().left - div2.offset().left;
    distancey = div1.offset().top - div2.offset().top;
    const animate_to = (div, x, y, t) => div.animate({
        left: x,
        top: y
    }, t);
    const reset_animation = div => {
        div.css('left', '0px');
        div.css('top', '0px');
    }

    if (div2.length) {
        $.when(
            animate_to(div1, -distancex, -distancey, t),
            animate_to(div2, distancex, distancey, t))
            .done(function () {
                reset_animation(div1);
                reset_animation(div2);
                swapDivInHeierachy(div1, div2);
                cb();
            });

    }
}