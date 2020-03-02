let sort_step = (lst) => {
    for (let i = 0; i < lst.length - 1; i++) {
        if (lst[i] < lst[i + 1]) {
            tmp = lst[i];
            lst[i] = lst[i + 1];
            lst[i + 1] = tmp;
            return lst;
        }
    }
    return lst;
}
const max_life = 3;
let cLife = max_life;
const life_container = $("#lifeBar");
const make_life = node => {
    for (let x = 0; x < max_life; x++) {
        node.append(`<img id="life_${x}" class="life_container"/>`);
    }
    return life => {
        node.children('').each(function (i, life_container) {
            life_container.setAttribute("src", i < life ? "Images\\Full_Life.svg" : "Images\\Empty_Life.svg");
        });
    };
};
const set_life = make_life(life_container);
const item_container = $("#container");
const item_gen = (node) => {
    return n => {
        let count = node.children.length;
        for (let x = 0; x < Math.abs(n); x++) {
            if (n >= 0)
                node.append(`<div id="item_${count}" class="move">Item ${count++}</div>`);
            else
                $(node).remove(`#item_${--count - x}`);
        }

    };
};
const item_factory = item_gen(item_container);
item_factory(5);
set_life(cLife);
let animating = false;
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
                const current = getCurrentValues();
                current_order = current.join();
                next_step = sort_step(current).join();
                console.log(`${expected_order} == ${current_order}`);
                if (expected_order != current_order)
                    cLife--;
                set_life(cLife);
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