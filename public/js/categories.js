const params = new URLSearchParams(window.location.search);
const categoryID = params.get("categoryId");
const handlebarsHook = document.getElementById("templated_products_id");

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
      `https://wiki-shop.onrender.com/categories/${categoryID}/products`,
      requestOptions
    );
    const json = await response.json();
    loadData(json);
  } catch (err) {
    console.error("error:", err);
  }
}

function loadData(json) {
  const templateScript = Handlebars.compile(
    document.getElementById("handlebars-product-frame").innerHTML
  );
  const html = templateScript({ categories: json });
  handlebarsHook.innerHTML = html;
  console.log(json);
  console.log(html);
}
