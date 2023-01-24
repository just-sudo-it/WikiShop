let allProducts;
let allSubcategories;

const params = new URLSearchParams(window.location.search);
const categoryID = params.get("categoryId");
const basicHeaders = new Headers();
basicHeaders.append("Accept", "application/json");

const getRequestOptions = { method: "GET", headers: basicHeaders };
const handlebarsHook = document.getElementById("templated_products_id");
const handlebarsSubcategoryHook = document.getElementById(
  "templated_subcategories_id"
);
const subcategoryForm = document.querySelector("#subcategory-form");

//hook event listener for subcategory filtering
subcategoryForm.addEventListener("change", (event) => {
  const selectedSubcategory = event.target.value;
  const products = getProductsBySubcategory(selectedSubcategory);
  renderCategoryProducts(products);
});

Init();

async function Init() {
  try {
    const [products, subcategories] = await Promise.all([
      getProducts(),
      getSubcategories(),
    ]);
    allProducts = products;
    allSubcategories = subcategories;

    renderData(products, subcategories);
  } catch (err) {
    console.error("Error: ", err);
  }
}

//HANDLEBARS RENDERING
function renderData(products, subcategories) {
  renderCategoryProducts(products);
  renderSubcategories(subcategories);
}
function renderCategoryProducts(products) {
  const productTemplateScript = Handlebars.compile(
    document.getElementById("handlebars-product-frame").innerHTML
  );
  const productHtml = productTemplateScript({ categories: products });
  handlebarsHook.innerHTML = productHtml;
}
function renderSubcategories(subcategories) {
  const subcategoryTemplateScript = Handlebars.compile(
    document.getElementById("handlebars-subcategory-frame").innerHTML
  );
  const subcategoryHtml = subcategoryTemplateScript({
    subcategories: subcategories,
  });
  handlebarsSubcategoryHook.innerHTML = subcategoryHtml;
}

//API CALLS
async function getProducts() {
  try {
    const response = await fetch(
      `https://wiki-shop.onrender.com/categories/${categoryID}/products`,
      getRequestOptions
    );
    return await response.json();
  } catch (err) {
    console.error("Error: ", err);
  }
}

async function getSubcategories() {
  try {
    const response = await fetch(
      `https://wiki-shop.onrender.com/categories/${categoryID}/subcategories`,
      getRequestOptions
    );
    const subcategories = await response.json();
    subcategories.unshift({ id: 0, category_id: 0, title: "All" });
    return subcategories;
  } catch (err) {
    console.error("Error: ", err);
  }
}

function getProductsBySubcategory(subcategoryId) {
  return allProducts.filter(
    (product) =>
      product.subcategory_id === parseInt(subcategoryId) ||
      parseInt(subcategoryId) === 0
  );
}

async function addToCart(e) {
  const { id, title, cost, description, image } = e.target.dataset;
  const sessionId = sessionStorage.getItem("session-id");
  const username = sessionStorage.getItem("username");

  try {
    // url????????????
    const res = await fetch("http://localhost:8080/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "session-id": sessionId,
      },
      body: JSON.stringify({
        id: id,
        title: title,
        cost: cost,
        description: description,
        image: image,
        username: username,
      }),
    });
    if (res?.redirected) {
      window.location.href = res.url;
    } else if (!res?.ok) {
      console.log("Error");
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}
async function getCartSize() {
  const sessionId = sessionStorage.getItem("session-id");
  const username = sessionStorage.getItem("username");

  try {
    const res = await fetch("/cart-size", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "session-id": sessionId,
      },
      body: JSON.stringify({ username: username }),
    });

    if (res?.redirected) {
      window.location.href = res.url;
    }

    const { message } = await res.json();
    console.log(message);
  } catch (err) {
    console.log(err);
  }
}
