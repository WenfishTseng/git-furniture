// dom
const orderList = document.querySelector(".orderList");
const deleteAllOrderBtn = document.querySelector(".deleteAllOrderBtn");

// variables
const api_path = "yurit630";
const token = "pI1fp1SJC0XQfpViyEBA5VJlqkv2";

// 監聽類
// 商品訂單
orderList.addEventListener("click", (e) => {
  if (e.target.nodeName !== "BUTTON") return;
  deleteSingleOrder(e.target.dataset.order);
});
// 清出全部訂單 btn
deleteAllOrderBtn.addEventListener("click", (e) => {
  if (e.target.nodeName !== "BUTTON") return;
  deleteAllOrders();
});

init();

function init() {
  getOrderList();
}

function deleteAllOrders() {
  let url = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`;
  axios
    .delete(url, {
      headers: {
        Authorization: token,
      },
    })
    .then(function (response) {
      if (response.data.status) {
        console.log("deleteSingleOrder", response.data.orders);
        renderPdtList(response.data.orders);
      }
    })
    .catch(function (error) {
      console.log("deleteSingleOrder error: " + error);
    });
}

function deleteSingleOrder(orderId) {
  let url = `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`;
  axios
    .delete(url, {
      headers: {
        Authorization: token,
      },
    })
    .then(function (response) {
      // 成功會回傳的內容
      if (response.data.status) {
        console.log("deleteSingleOrder", response.data.orders);
        renderPdtList(response.data.orders);
      }
    })
    .catch(function (error) {
      // 失敗會回傳的內容
      console.log("deleteSingleOrder error: " + error);
    });
}

function getOrderList() {
  axios
    .get(
      `https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
      {
        headers: {
          Authorization: token,
        },
      }
    )
    .then((response) => {
      if (response.data.status) {
        // 渲染訂單資料
        renderPdtList(response.data.orders);
        console.log(response.data.orders);
      }
    })
    .catch(function (error) {
      console.log("getOrderList: ", error);
    });
}

function renderPdtList(order) {
  let str = "";
  let categoryObj = {};
  let titleObj = {};
  order.forEach((item) => {
    // list html
    str += `
          <tr>
            <th scope="row">${item.id}</th>
            <td>${item.user.name}<br>${item.user.tel}</td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>${item.products[0].title}</td>
            <td>${getUpdateTime(item.updatedAt)}</td>
            <td><a class="btn btn-link" href="#">${
              item.paid ? "已處理" : "未處理"
            }</a></td>
            <td><button class="btn btn-danger btn-sm rounded-0" data-order="${
              item.id
            }">刪除</button></td>
          </tr>
      `;
    item.products.forEach((value) => {
      // 取出種類物件
      if (categoryObj[value.category] == undefined) {
        categoryObj[value.category] = 1;
      } else {
        categoryObj[value.category]++;
      }
      // 取出各項商品物件
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
  const categoryAry = Object.keys(categoryObj);
  let chartAry = [];
  categoryAry.forEach((item) => {
    let ary = [];
    ary.push(item);
    ary.push(categoryObj[item]);
    chartAry.push(ary);
  });
  let chartData = chartAry;
  let chart = c3.generate({
    bindto: "#chart",
    data: {
      columns: chartData,
      type: "pie",
    },
    color: {
      pattern: ["#5434A7", "#9D7FEA", "#DACBFF"],
    },
  });
}

function renderRevenueChart(commodityObj) {
  const commodityAry = Object.keys(commodityObj);
  let chartAry = [];
  commodityAry.forEach((item) => {
    let ary = [];
    ary.push(item);
    ary.push(commodityObj[item]);
    chartAry.push(ary);
  });
  let chartData = chartAry;
  let chart2 = c3.generate({
    bindto: "#chart2",
    data: {
      columns: chartData,
      type: "pie",
    },
    color: {
      pattern: [
        "#301E5F",
        "#5434A7",
        "#9D7FEA",
        "#DACBFF",
        "#1f77b4",
        "#aec7e8",
        "#ff7f0e",
        "#ffbb78",
        "#2ca02c",
        "#98df8a",
      ],
    },
  });
}

function getUpdateTime(timestamp) {
  let date = new Date(timestamp);
  let time =
    date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
  return time;
}
