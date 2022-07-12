//State management
const UserData = {
  users: [
    { name: "Jay Nguyen", mobile: "123456789", email: "asdkjj@gmail.com" },
    { name: "K", mobile: "123456789", email: "asdkjj@gmail.com" },
    { name: "A", mobile: "5714578541", email: "as345dkjj@gmail.com" },
    { name: "B", mobile: "777888999", email: "hdfkj@gmail.com" },
    { name: "C", mobile: "7038742541", email: "12515asfs34@gmail.com" },
  ],

  addUser: function (data) {
    if (data) {
      this.users.push(data);
    }
  },
  removeAUser: function (data) {
    this.users = this.users.filter((each) => {
      return JSON.stringify(each) !== JSON.stringify(data);
    });
  },
  getUsers: function () {
    return this.users;
  },
  setUser: function (users) {
    this.users = users;
  },
};

//View model element
const ViewModel = (() => {
  const inputList = document.querySelectorAll("[data-content]");
  const btn_contact = document.getElementById("submit");
  const error_ = document.querySelector("#error");
  const displayData = document.querySelector("tbody");
  const searchResult = document.getElementById("noResult");
  const tableNameSort = document.getElementById("nameColumn");
  const search = document.getElementById("search");
  return {
    inputList,
    error_,
    displayData,
    searchResult,
    tableNameSort,
    search,
    btn_contact,
  };
})();

//Rendering function
const render = (() => {
  const data = () => {
    const data = UserData.getUsers();
    let htmlBody = "";
    data.forEach((each) => {
      htmlBody += ` <tr>
            <td>${each.name}</td>
            <td>${each.mobile}</td>
            <td>${each.email}</td>
          </tr>`;
    });
    ViewModel.displayData.innerHTML = htmlBody;
  };

  const customData = (data) => {
    let htmlBody = "";
    data.forEach((each) => {
      htmlBody += ` <tr>
            <td>${each.name}</td>
            <td>${each.mobile}</td>
            <td>${each.email}</td>
          </tr>`;
    });
    ViewModel.displayData.innerHTML = htmlBody;
  };
  return { data, customData };
})();

//Control actions
const controller = (() => {
  const onAddContact = () => {
    const [error, data] = [[], {}];

    ViewModel.inputList.forEach((each) => {
      data[each.id] = each.value;
    });

    //Check
    if (!utils.isValidMobile(data.mobile)) {
      error.push("Invalid mobile");
    }

    if (!utils.isValidName(data.name)) {
      error.push("Invalid Name");
    }

    if (!utils.isValidEmail(data.email)) {
      error.push("Invalid Email");
    }

    //If error do this
    if (error.length > 0) {
      console.log(error);
      ViewModel.error_.classList.remove("dn");
      return;
    } else {
      ViewModel.error_.classList.add("dn");
    }
    //Add
    UserData.addUser(data);
    ViewModel.inputList.forEach((each) => {
      each.value = "";
    });
    render.data();
  };

  const onSearch = (event) => {
    const result = UserData.getUsers().filter((each) =>
      each.mobile.includes(event.target.value)
    );
    if (result.length <= 0) {
      ViewModel.searchResult.classList.remove("dn");
    } else {
      ViewModel.searchResult.classList.add("dn");
    }
    render.customData(result);
  };

  const init = () => {
    ViewModel.btn_contact.addEventListener("click", controller.onAddContact);
    ViewModel.search.addEventListener("keyup", onSearch);

    ViewModel.tableNameSort.addEventListener("click", (e) => {
      utils.sortTable("summaryTable", 0);
    });

    render.data();
  };

  return { onAddContact, init };
})();

//Utils for validate data
const utils = (() => {
  const isValidName = (name) => {
    if (name.length > 20 || name === "") {
      return false;
    }
    return /^[A-Za-z\s]*$/.test(name);
  };
  const isValidMobile = (mobile) => {
    if (mobile.length !== 10 || mobile === "") {
      return false;
    }
    return /^\d+$/.test(mobile);
  };
  const isValidEmail = (email) => {
    if (email.length >= 40) {
      return false;
    }
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const sortAcsending = (a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  };

  const sortDecending = (a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    if (nameA > nameB) {
      return -1;
    }
    if (nameA < nameB) {
      return 1;
    }

    return 0;
  };

  //Custom sort table using bubbleSort
  const sortTable = function sortTable(table_, column) {
    let table = document.getElementById(table_);
    let rows = table.rows;
    let len = rows.length;
    for (let i = 1; i < len - 1; i++) {
      for (let j = 1; j < len - 1; j++) {
        let x = rows[j].getElementsByTagName("TD")[column];
        let y = rows[j + 1].getElementsByTagName("TD")[column];
        if (table.dataset.target === "acs") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            rows[j].parentNode.insertBefore(rows[j + 1], rows[j]);
          }
        } else {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            rows[j].parentNode.insertBefore(rows[j + 1], rows[j]);
          }
        }
      }
    }
    if (table.dataset.target === "acs") {
      table.dataset.target = "desc";
    } else {
      table.dataset.target = "acs";
    }
  };
  return {
    isValidName,
    isValidMobile,
    isValidEmail,
    sortAcsending,
    sortDecending,
    sortTable,
  };
})();




//Initilize.
controller.init();
