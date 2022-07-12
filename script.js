//State management
const UserData = {
  users: [
    { name: "Jay Nguyen", mobile: "123456789", email: "asdkjj@gmail.com" },
    { name: "K", mobile: "123456789", email: "asdkjj@gmail.com" },
    { name: "A", mobile: "5714578541", email: "as345dkjj@gmail.com" },
    { name: "B", mobile: "777888999", email: "hdfkj@gmail.com" },
    { name: "C", mobile: "7038742541", email: "12515asfs34@gmail.com" },
    { name: "Adam", mobile: "1231231233", email: "test@test.abc" },
    { name: "Tom", mobile: "8901234567", email: "test@test.edu" },
    { name: "David", mobile: "1234567890", email: "rty@test.cn" },
    { name: "Helen", mobile: "6789012345", email: "erty@test.yahoo" },
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
  const data = (data = UserData.getUsers()) => {
    let htmlBody = "";
    data.forEach((each) => {
      htmlBody += ` <tr title="Click to remove this person!">
            <td id="name">${each.name}</td>
            <td id="mobile">${each.mobile}</td>
            <td id="email">${each.email}</td>
          </tr>`;
    });
    ViewModel.displayData.innerHTML = htmlBody;
  };

  return { data };
})();

//Control actions
const controller = (() => {
  const onAddContact = () => {
    const data = {};
    ViewModel.inputList.forEach((each) => {
      data[each.id] = each.value;
    });

    //Check if the input is valid.
    //Can access what type of error from error array.
    let error = utils.isInputValid(data);

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
    //Clear input
    ViewModel.inputList.forEach((each) => {
      each.value = "";
    });
    //Clear search
    ViewModel.search.value = "";

    //Re-render element
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
    render.data(result);
  };

  const onDeleteItem = (event) => {
    const data = {};
    //event.path[1] = the current row clicked;

    data["name"] = event.path[1].getElementsByTagName("td").name.innerHTML;
    data["mobile"] = event.path[1].getElementsByTagName("td").mobile.innerHTML;
    data["email"] = event.path[1].getElementsByTagName("td").email.innerHTML;

    let isExecuted = confirm(`Are you sure to delete ${data.name}`);

    if (!isExecuted) {
      return;
    }

    //event.path[2] = the table body in which can remove child which is event.path[1]
    event.path[2].removeChild(event.path[1]);

    //Some control delay
    setTimeout(() => {
      UserData.removeAUser(data);
    }, 500);
  };

  const init = () => {
    //Setup event click on add
    ViewModel.btn_contact.addEventListener("click", onAddContact);
    //Key up on search
    ViewModel.search.addEventListener("keyup", onSearch);
    //Sort on the head table
    ViewModel.tableNameSort.addEventListener("click", (e) => {
      utils.sortTable("summaryTable", 0);
    });
    //Delete on target row
    ViewModel.displayData.addEventListener("click", onDeleteItem);

    //First render
    render.data();
  };

  return { init };
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
    if (email.length >= 40 || email.length == 0) {
      return false;
    }
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const isInputValid = (input) => {
    const error = [];
    //Check
    if (!isValidMobile(input.mobile)) {
      error.push("Invalid mobile");
    }

    if (!isValidName(input.name)) {
      error.push("Invalid Name");
    }

    if (!isValidEmail(input.email)) {
      error.push("Invalid Email");
    }
    return error;
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
    isInputValid,
    sortTable,
  };
})();

//Initilize.
controller.init();

//Set this on/off to access the state from browser for bug checking.
window.UserData = UserData;
