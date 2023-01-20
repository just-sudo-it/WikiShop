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
