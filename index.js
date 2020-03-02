let sort_steps = (lst) => {
    rval = []
    done = false;
    for (let x = 0; x < lst.length; x++) {
        for (let i = 0; i < lst.length - 1; i++) {
            if (lst[i] < lst[i + 1]) {
                tmp = lst[i];
                lst[i] = lst[i + 1];
                lst[i + 1] = tmp;

                var order = lst.join();
                rval.push(order);
            }
        }
        if (rval.slice(-2)[0] == rval.slice(-1)[0])
            break;
    }
    return rval;
}


const max_life = 3;
let cLife = max_life;
const life_container = $("#lifeBar");
const item_container = $("#container");

const hilightClass = "hilight";
const errClass = 'err';
const winClass ="win";
const lossClass = "loss";
const moveClass = "move";
const make_life = node => {
    for (let x = 0; x < max_life; x++)
        node.append(`<img id="life_${x}" class="life_container"/>`);

    return life => node.children('').each(function (i, life_container) {
        life_container.setAttribute("src", i < life ? "Images\\Full_Life.svg" : "Images\\Empty_Life.svg");
    });
};
const item_gen = (node) => {
    return (n, getContent = n => n) => {
        let count = node.children().length;
        for (let x = 0; x < Math.abs(n); x++)
            if (n >= 0)
                node.append(`<div id="item_${count}" class="move">Item ${getContent(count++)}</div>`);
            else
                $(node).children(`#item_${--count - x}`).remove();
        return node.children();
    };
};
const set_life = make_life(life_container);
const item_factory = item_gen(item_container);
item_factory(10, n => 1 + (1 + n) % 4);
set_life(cLife);
var steps = sort_steps(getCurrentValues());
let animating = false;
item_container.on('click', `.${moveClass}`, function () {
    if (!animating) {
        toggleClass($(this), hilightClass);
        var selected = item_container.children(`.${hilightClass}`);
        if (selected.length >= 2) {
            animating = true;
            swap_divs(selected, 200, (divs) => {
                divs.forEach(d => d.removeClass(hilightClass));
                current_order = getCurrentValues().join();
                if (steps[0] != current_order) {
                    cLife--;
                    if (cLife <= 0) {
                        item_container.children(`.${moveClass}`).addClass(lossClass);
                        item_container.children(`.${moveClass}`).removeClass(moveClass);
                    }
                    divs.forEach(e => e.addClass(errClass));
                    swap_divs(divs, 200, (divs) => {
                        divs.forEach(e => e.removeClass(errClass));
                    });
                }
                else {
                    steps.shift();
                    if (steps.length <= 0) {
                        item_container.children(`.${moveClass}`).addClass(winClass);
                        item_container.children(`.${moveClass}`).removeClass(moveClass);
                    }
                }
                set_life(cLife);
                animating = false;
            });
        }
    }
})

function getCurrentValues() {
    return item_container.children(`.${moveClass}`).map((i, item) => parseInt($(item).text().match(/\d+/)[0])).get();
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
    return [tdiv1, tdiv2];
}
function swap_divs(divs, t, cb = () => { }) {
    const div1 = $(divs[0]);
    const div2 = $(divs[1]);
    distancex = div1.offset().left - div2.offset().left;
    distancey = div1.offset().top - div2.offset().top;
    const animate_to = (div, x, y, t) => div.animate({
        left: x,
        top: y
    }, t);
    const reset_animation = div => {
        div.removeAttr('style');
    }

    if (div2.length) {
        return $.when(
            animate_to(div1, -distancex, -distancey, t),
            animate_to(div2, distancex, distancey, t))
            .done(function () {
                reset_animation(div1);
                reset_animation(div2);
                cb(swapDivInHeierachy(div1, div2));
            });

    }
}