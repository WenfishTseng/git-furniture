"use strict";

$(function () {
  console.log("Hello Bootstrap5");
}); // variables

var api_path = "yurit630";
var token = "pI1fp1SJC0XQfpViyEBA5VJlqkv2";
var categoryAry = [];
var allProducts = []; //dom

var pdtList = document.querySelector(".pdtList");
var categorySelect = document.querySelector(".categorySelect");
var cartList = document.querySelector(".cartList");
var deleteBtn = document.querySelector(".deleteBtn"); // 監聽

pdtList.addEventListener("click", function (e) {
  e.preventDefault;
  if (e.target.nodeName != "A") return;
  console.log(e.target.dataset.num);
  addItemToCart(e.target.dataset.num);
});
categorySelect.addEventListener("change", function (e) {
  renderSelectData(e.target.value);
});
cartList.addEventListener("click", function (e) {
  if (e.target.nodeName != "I") return;
  deleteCartId(e.target.dataset.cart);
});
deleteBtn.addEventListener("click", function (e) {
  e.preventDefault;
  deleteAllCarts();
});
initView();

function initView() {
  getProductList();
  getCartList();
} // 刪除購物車全部品項


function deleteAllCarts() {
  var url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts");
  axios["delete"](url).then(function (response) {
    // 成功會回傳的內容
    if (response.data.status) {
      renderCartData(response.data.carts);
    }
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
} // 刪除購物車特定產品


function deleteCartId(cartId) {
  var url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts/").concat(cartId);
  axios["delete"](url).then(function (response) {
    // 成功會回傳的內容
    if (response.data.status) {
      renderCartData(response.data.carts);
    }
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log(error);
  });
} // 取得產品列表


function getProductList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/products")).then(function (response) {
    if (response.data.status === true) {
      var products = response.data.products;
      allProducts = JSON.parse(JSON.stringify(products));
      renderPdtData(products); // 產品有的種類

      var temp = [];
      products.forEach(function (item) {
        temp.push(item.category);
      });
      categoryAry = Array.from(new Set(temp));
      renderSelect(categoryAry);
    }
  })["catch"](function (error) {
    console.log(error.response.data);
  });
} // 取得購物車列表


function getCartList() {
  var url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts");
  axios.get(url).then(function (response) {
    if (response.data.status === true) {
      renderCartData(response.data.carts);
    }
  })["catch"](function (error) {
    console.log(error);
  });
} // 渲染購物車商品列表


function renderCartData(cartData) {
  var str = "";
  var total = 0; // 購物車商品

  cartData.forEach(function (item) {
    str += "          \n    <tr class=\"tableCart\">\n            <td scope=\"row\" class=\"d-flex align-items-center\">\n              <img\n                class=\"cartImg d-none d-md-block\"\n                src=\"".concat(item.product.images, "\"\n                alt=\"").concat(item.product.title, "\"\n              />\n              <h3 class=\"h4 d-inline-block ms-md-6 mb-0\">\n                ").concat(item.product.title, "\n              </h3>\n            </td>\n            <td>NT$").concat(item.product.price, "</td>\n            <td>").concat(item.quantity, "</td>\n            <td>NT$").concat(item.product.price, "</td>\n            <td>\n              <a href=\"#\" class=\"btn btn-link\"\n                ><i data-cart=\"").concat(item.id, "\" class=\"fas fa-times\" style=\"font-size: 24px\"></i>\n              </a>\n            </td>\n          </tr>");
    total += item.quantity * item.product.price;
  });
  cartList.innerHTML = str;
  console.log("total", total);
  var totalAmount = document.querySelector(".totalAmount");
  totalAmount.innerHTML = "NT$ ".concat(total);
} // 渲染Select : 種類


function renderSelect(selData) {
  var str = '<option selected disabled>請選擇種類</option><option value="all">全部</option>';
  selData.forEach(function (item) {
    str += "\n    <option value=\"".concat(item, "\">").concat(item, "</option>\n    ");
  });
  categorySelect.innerHTML = str;
} // 渲染Select 選擇資料後的畫面


function renderSelectData(category) {
  var filterAry = [];

  if (category !== "all") {
    filterAry = allProducts.filter(function (item) {
      if (category === item.category) {
        console.log(item.category);
        return item;
      }
    });
  } else {
    filterAry = allProducts;
  }

  renderPdtData(filterAry);
} // 渲染產品清單


function renderPdtData(data) {
  var str = "";
  data.forEach(function (item) {
    str += "\n        <li class=\"col mt-0 mb-11\">\n      <div class=\"card h-100 border-0 position-relative\">\n        <span\n          class=\"\n            pdtBadge\n            badge\n            rounded-0\n            bg-primary\n            position-absolute\n            top-10\n            start-85\n            translate-middle\n          \"\n          >\u65B0\u54C1</span\n        >\n        <img\n          src=\"".concat(item.images, "\"\n          class=\"card-img-top\"\n          alt=\"").concat(item.title, "\"\n        />\n        <div class=\"card-body p-0\">\n          <a class=\"btn btn-primary w-100 rounded-0 fz-4 py-3 mb-3\" href=\"#\" data-num=\"").concat(item.id, "\"\n            >\u52A0\u5165\u8CFC\u7269\u8ECA</a\n          >\n          <h3 class=\"h4\" data-category=\"").concat(item.category, "\">").concat(item.title, "</h3>\n          <p class=\"h4 text-decoration-line-through mb-0\">NT$").concat(item.origin_price, "</p>\n          <p class=\"h2 fw-bold mb-0\">NT$").concat(item.price, "</p>\n        </div>\n      </div>\n    </li>\n    ");
  });
  pdtList.innerHTML = str;
} // 將單一商品加入購物車列表


function addItemToCart(cartId) {
  var url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/".concat(api_path, "/carts");
  axios.post(url, {
    data: {
      productId: "".concat(cartId),
      quantity: 1
    }
  }).then(function (response) {
    if (response.data.status) {
      renderCartData(response.data.carts);
    }
  })["catch"](function (error) {
    console.log(error.response.data);
  });
}
//# sourceMappingURL=all.js.map
