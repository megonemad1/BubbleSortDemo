var sort_step = (lst) => {
    for (var i = 0; i < lst.length - 1; i++) {
        if (lst[i]<lst[i+1]){
            tmp = lst[i];
            lst[i] = lst[i+1];
            lst[i+1] = tmp;
            return lst;
        }
    }
    return lst;
}
var score = 0;

$('#container').on('click', '.move', function () {
    const hilightclass = "hilight";
    toggleClass($(this), hilightclass);
    var selected = $(`#container .${hilightclass}`);
    if (selected.length >= 2) {
        let div1 = $(selected[0]);
        let div2 = $(selected[1]);
        const expected_order = sort_step(getCurrentValues()).join();
        swap_divs(div1, div2, 2000, () => {
            console.log(expected_order);
            const current_order = getCurrentValues().join();
            console.log(current_order);
            if (expected_order == current_order)
                score++;
            $('#score').text(score);
        });
        div1.removeClass(hilightclass);
        div2.removeClass(hilightclass);
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

    if (div2.length) {
        $.when(div1.animate({
            left: -distancex,
            top: -distancey
        }, t),
            div2.animate({
                left: distancex,
                top: distancey
            }, t)).done(function () {
                div2.css('left', '0px');
                div1.css('left', '0px');
                div2.css('top', '0px');
                div1.css('top', '0px');
                swapDivInHeierachy(div1, div2);
                cb();
            });

    }
}