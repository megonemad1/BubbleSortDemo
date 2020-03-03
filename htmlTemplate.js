const script = $(document.currentScript);
const template = script.attr('href');
$.get(template, function(data) {
    script.replaceWith($(data).attr("data",template));
});