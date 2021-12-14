"use strict";

// dom
var orderList = document.querySelector(".orderList");
var deleteAllOrderBtn = document.querySelector(".deleteAllOrderBtn"); // variables

var api_path = "yurit630";
var token = "pI1fp1SJC0XQfpViyEBA5VJlqkv2"; // 監聽類
// 商品訂單

orderList.addEventListener("click", function (e) {
  if (e.target.nodeName !== "BUTTON") return;
  deleteSingleOrder(e.target.dataset.order);
}); // 清出全部訂單 btn

deleteAllOrderBtn.addEventListener("click", function (e) {
  if (e.target.nodeName !== "BUTTON") return;
  deleteAllOrders();
});
init();

function init() {
  getOrderList();
}

function deleteAllOrders() {
  var url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders");
  axios["delete"](url, {
    headers: {
      Authorization: token
    }
  }).then(function (response) {
    if (response.data.status) {
      console.log("deleteSingleOrder", response.data.orders);
      renderPdtList(response.data.orders);
    }
  })["catch"](function (error) {
    console.log("deleteSingleOrder error: " + error);
  });
}

function deleteSingleOrder(orderId) {
  var url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders/").concat(orderId);
  axios["delete"](url, {
    headers: {
      Authorization: token
    }
  }).then(function (response) {
    // 成功會回傳的內容
    if (response.data.status) {
      console.log("deleteSingleOrder", response.data.orders);
      renderPdtList(response.data.orders);
    }
  })["catch"](function (error) {
    // 失敗會回傳的內容
    console.log("deleteSingleOrder error: " + error);
  });
}

function getOrderList() {
  axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/".concat(api_path, "/orders"), {
    headers: {
      Authorization: token
    }
  }).then(function (response) {
    if (response.data.status) {
      // 渲染訂單資料
      renderPdtList(response.data.orders);
      console.log(response.data.orders);
    }
  })["catch"](function (error) {
    console.log("getOrderList: ", error);
  });
}

function renderPdtList(order) {
  var str = "";
  var categoryObj = {};
  var titleObj = {};
  order.forEach(function (item) {
    // list html
    str += "\n          <tr>\n            <th scope=\"row\">".concat(item.id, "</th>\n            <td>").concat(item.user.name, "<br>").concat(item.user.tel, "</td>\n            <td>").concat(item.user.address, "</td>\n            <td>").concat(item.user.email, "</td>\n            <td>").concat(item.products[0].title, "</td>\n            <td>").concat(getUpdateTime(item.updatedAt), "</td>\n            <td><a class=\"btn btn-link\" href=\"#\">").concat(item.paid ? "已處理" : "未處理", "</a></td>\n            <td><button class=\"btn btn-danger btn-sm rounded-0\" data-order=\"").concat(item.id, "\">\u522A\u9664</button></td>\n          </tr>\n      ");
    item.products.forEach(function (value) {
      // 取出種類物件
      if (categoryObj[value.category] == undefined) {
        categoryObj[value.category] = 1;
      } else {
        categoryObj[value.category]++;
      } // 取出各項商品物件


      if (titleObj[value.title] == undefined) {
        titleObj[value.title] = 1;
      } else {
        titleObj[value.title]++;
      }
    });
  });
  orderList.innerHTML = str;
  renderCategoryChart(categoryObj);
  renderRevenueChart(titleObj);
}

function renderCategoryChart(categoryObj) {
  var categoryAry = Object.keys(categoryObj);
  var chartAry = [];
  categoryAry.forEach(function (item) {
    var ary = [];
    ary.push(item);
    ary.push(categoryObj[item]);
    chartAry.push(ary);
  });
  var chartData = chartAry;
  var chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: chartData,
      type: "pie"
    },
    color: {
      pattern: ["#5434A7", "#9D7FEA", "#DACBFF"]
    }
  });
}

function renderRevenueChart(commodityObj) {
  var commodityAry = Object.keys(commodityObj);
  var chartAry = [];
  commodityAry.forEach(function (item) {
    var ary = [];
    ary.push(item);
    ary.push(commodityObj[item]);
    chartAry.push(ary);
  });
  var chartData = chartAry;
  var chart2 = c3.generate({
    bindto: "#chart2",
    data: {
      columns: chartData,
      type: "pie"
    },
    color: {
      pattern: ["#301E5F", "#5434A7", "#9D7FEA", "#DACBFF", "#1f77b4", "#aec7e8", "#ff7f0e", "#ffbb78", "#2ca02c", "#98df8a"]
    }
  });
}

function getUpdateTime(timestamp) {
  var date = new Date(timestamp);
  var time = date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
  return time;
}