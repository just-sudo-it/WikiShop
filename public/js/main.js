const templateHook = document.getElementById("categories_id");
OnLoad();

async function OnLoad() {
  try {
    var hdrs = new Headers();
    hdrs.append("Accept", "application/json");

    var requestOptions = {
      method: "GET",
      headers: hdrs,
    };

    const response = await fetch(
      "https://wiki-shop.onrender.com/categories",
      requestOptions
    );
    const json = await response.json();
    loadData(json);
  } catch (err) {
    console.error("error:", err);
  }
}

function loadData(json) {
  var templateScript = Handlebars.compile(
    document.getElementById("handlebars-demo").innerHTML
  );
  var html = templateScript({ categories: json });
  console.log(json);
  console.log(html);
  templateHook.innerHTML = html;
}
