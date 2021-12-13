$(function () {
  // console.log("Hello Bootstrap5");
});

// variables
const api_path = "yurit630";
const token = "pI1fp1SJC0XQfpViyEBA5VJlqkv2";
let categoryAry = [];
let allProducts = [];
//dom
const pdtList = document.querySelector(".pdtList");
const categorySelect = document.querySelector(".categorySelect");
const cartList = document.querySelector(".cartList");
const deleteBtn = document.querySelector(".deleteBtn");
const myForm = document.getElementById("myForm");
const sendBtn = document.querySelector(".sendBtn");

// 監聽
pdtList.addEventListener("click", (e) => {
  e.preventDefault;
  if (e.target.nodeName != "BUTTON") return;
  addItemToCart(e.target.dataset.num);
});

categorySelect.addEventListener("change", (e) => {
  renderSelectData(e.target.value);
});

cartList.addEventListener("click", (e) => {
  e.preventDefault;
  if (e.target.nodeName != "I") return;
  deleteCartId(e.target.dataset.cart);
});

deleteBtn.addEventListener("click", (e) => {
  e.preventDefault;
  deleteAllCarts();
});

initView();

function initView() {
  getProductList();
  getCartList();
}

// 刪除購物車全部品項
function deleteAllCarts() {
  let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`;
  axios
    .delete(url)
    .then(function (response) {
      // 成功會回傳的內容
      if (response.data.status) {
        renderCartData(response.data.carts);
      }
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log("deleteAllCarts", error);
    });
}

// 刪除購物車特定產品
function deleteCartId(cartId) {
  let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId}`;
  axios
    .delete(url)
    .then(function (response) {
      // 成功會回傳的內容
      if (response.data.status) {
        renderCartData(response.data.carts);
      }
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log(error);
    });
}

// 取得產品列表
function getProductList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`
    )
    .then(function (response) {
      if (response.data.status === true) {
        let products = response.data.products;
        allProducts = JSON.parse(JSON.stringify(products));
        renderPdtData(products);
        // 產品有的種類
        let temp = [];
        products.forEach((item) => {
          temp.push(item.category);
        });
        categoryAry = Array.from(new Set(temp));
        renderSelect(categoryAry);
      }
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
}

// 取得購物車列表
function getCartList() {
  let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`;
  axios
    .get(url)
    .then(function (response) {
      if (response.data.status === true) {
        renderCartData(response.data.carts);
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}

// 渲染購物車商品列表
function renderCartData(cartData) {
  let str = "";
  let total = 0;
  // 購物車商品
  cartData.forEach((item) => {
    str += `          
    <tr class="tableCart">
            <td scope="row" class="d-flex align-items-center">
              <img
                class="cartImg d-none d-md-block"
                src="${item.product.images}"
                alt="${item.product.title}"
              />
              <h3 class="h4 d-inline-block ms-md-6 mb-0">
                ${item.product.title}
              </h3>
            </td>
            <td>NT$${item.product.price}</td>
            <td>${item.quantity}</td>
            <td>NT$${item.product.price}</td>
            <td>
              <button href="#" class="btn btn-link"
                ><i data-cart="${item.id}" class="fas fa-times" style="font-size: 24px"></i>
              </button>
            </td>
          </tr>`;
    total += item.quantity * item.product.price;
  });
  cartList.innerHTML = str;
  const totalAmount = document.querySelector(".totalAmount");
  totalAmount.innerHTML = `NT$ ${total}`;
}

// 渲染Select : 種類
function renderSelect(selData) {
  let str =
    '<option selected disabled>請選擇種類</option><option value="all">全部</option>';
  selData.forEach((item) => {
    str += `
    <option value="${item}">${item}</option>
    `;
  });
  categorySelect.innerHTML = str;
}

// 渲染Select 選擇資料後的畫面
function renderSelectData(category) {
  let filterAry = [];
  if (category !== "all") {
    filterAry = allProducts.filter((item) => {
      if (category === item.category) {
        return item;
      }
    });
  } else {
    filterAry = allProducts;
  }
  renderPdtData(filterAry);
}

// 渲染產品清單
function renderPdtData(data) {
  let str = "";
  data.forEach((item) => {
    str += `
        <li class="col mt-0 mb-11">
      <div class="card h-100 border-0 position-relative">
        <span
          class="
            pdtBadge
            badge
            rounded-0
            bg-primary
            position-absolute
            top-10
            start-85
            translate-middle
          "
          >新品</span
        >
        <img
          src="${item.images}"
          class="card-img-top"
          alt="${item.title}"
        />
        <div class="card-body p-0">
          <button class="btn btn-primary w-100 rounded-0 fz-4 py-3 mb-3" href="#" data-num="${item.id}"
            >加入購物車</button
          >
          <h3 class="h4" data-category="${item.category}">${item.title}</h3>
          <p class="h4 text-decoration-line-through mb-0">NT$${item.origin_price}</p>
          <p class="h2 fw-bold mb-0">NT$${item.price}</p>
        </div>
      </div>
    </li>
    `;
  });
  pdtList.innerHTML = str;
}

// 將單一商品加入購物車列表
function addItemToCart(cartId) {
  let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`;
  axios
    .post(url, {
      data: {
        productId: `${cartId}`,
        quantity: 1,
      },
    })
    .then(function (response) {
      if (response.data.status) {
        renderCartData(response.data.carts);
      }
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
}

let swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 10,
  autoplay: {
    delay: 3500,
    disableOnInteraction: false,
  },
  breakpoints: {
    "@0.00": {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    "@0.75": {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    "@1.00": {
      slidesPerView: 3,
      spaceBetween: 40,
    },
  },
});

let constraints = {
  name: {
    // 必填
    presence: {
      message: "必填",
    },
  },
  telephone: {
    presence: {
      message: "必填",
    },
  },
  email: {
    presence: {
      message: "必填",
    },
  },
  address: {
    presence: {
      message: "必填",
    },
  },
  trade: {
    presence: {
      message: "必填",
    },
  },
};

const inputs = document.querySelectorAll("input, select[name=trade]");

let tempForm = [];
sendBtn.addEventListener("click", () => {
  checkInputs();
  let userObj = {
    name: "default",
    tel: "default",
    email: "default",
    address: "default",
    payment: "default",
  };
  inputs.forEach((item) => {
    if (item.name === "trade") userObj["payment"] = item.value;
    if (item.name === "telephone") userObj["tel"] = item.value;
    Object.keys(userObj).forEach((keys) => {
      if (keys === item.name) userObj[item.name] = item.value;
    });
  });
  sendCartOrder(userObj);
});

function checkInputs() {
  // 清除原本的表格欄位
  tempForm.forEach(function (item) {
    document.querySelector(`.${item}`).textContent = "";
  });
  const errors = validate(myForm, constraints);
  //呈現在畫面上
  if (errors) {
    Object.keys(errors).forEach(function (keys) {
      document.querySelector(`.${keys}`).textContent = "必填!";
      tempForm.push(keys);
    });
  }
  console.log(errors);
}

function sendCartOrder(userData) {
  let url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`;
  axios
    .post(url, {
      data: { user: userData },
    })
    .then(function (response) {
      console.log(response.data);
      renderCartData([]);
      alert("訂單完成!");
      document.querySelectorAll("input").forEach((item) => {
        item.value = "";
      });
    })
    .catch(function (error) {
      console.log(error.response.data);
    });
}
