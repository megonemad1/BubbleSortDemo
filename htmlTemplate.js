const script = $(document.currentScript);
const template = script.attr('data');
$.get(template, function(data) {
    script.replaceWith($(data).attr("data",template));
});