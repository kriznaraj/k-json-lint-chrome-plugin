const options = {
  linkUrls: true,
  indent: 3,
  quoteKeys: false
};

$(".btn-primary").on("click", () => {
  let json = jQuery.trim(jQuery('#pd-json-area').val() || '');
  chrome.storage.local.set({
    jsonString: json
  }, function () {
    console.log('Saved - jsonString in local storage', json);
  });
  let parsedJSON = '{}';
  try {
    parsedJSON = JSON.parse(json);
  } catch (e) {
    $('#json-lint-outpout').html((e && e.message) || 'Invalid JSON');
    return;
  }
  chrome.storage.local.set({
    jsonOutput: parsedJSON
  }, function () {
    console.log('Saved - jsonOutput in local storage', parsedJSON);
  });
  $('#json-lint-outpout').html(prettyPrintJson.toHtml(parsedJSON, options));
});

$("#pd-quote-keys").on('change', (e) => {
  options.quoteKeys = e.target.checked;
  chrome.storage.local.set({
    options
  }, function () {
    console.log('Saved - jsonString in local storage', options);
  });
  chrome.storage.local.get("jsonOutput", function (res) {
    if (res.jsonOutput) {
      $('#json-lint-outpout').html(prettyPrintJson.toHtml(res.jsonOutput, options));
    }
  });
});

function init() {
  console.log('doc ready');
  chrome.storage.local.get("jsonString", function (res) {
    if (res.jsonString) {
      $('#pd-json-area').val(res.jsonString);
    }
  });

  chrome.storage.local.get("options", function (res) {
    if (res.options) {
      console.log(res.options);
      options.quoteKeys = res.options.quoteKeys;
      $('#pd-quote-keys').prop('checked', res.options.quoteKeys);
    }
  });

  chrome.storage.local.get("jsonOutput", function (res) {
    if (res.jsonOutput) {
      $('#json-lint-outpout').html(prettyPrintJson.toHtml(res.jsonOutput, options));
    }
  });
}

document.addEventListener('DOMContentLoaded', (event) => {
  console.log(event);
  init();
})