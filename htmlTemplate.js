const script = $(document.currentScript);
const template = script.attr('href');
script.replaceWith(jQuery(`<div href="${template}"></div>`).load(template));