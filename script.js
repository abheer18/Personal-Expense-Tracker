let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let totalAmount = 0;
let monthlySalary = Number(localStorage.getItem("monthlySalary")) || 0;
let creditCardAmount = Number(localStorage.getItem("creditCardAmount")) || 0;
let givenLoanAmount = Number(localStorage.getItem("givenLoanAmount")) || 0;
let takenLoanAmount = Number(localStorage.getItem("takenLoanAmount")) || 0;

const categorySelect = document.getElementById("category-select");
const amountInput = document.getElementById("amount-input");
const dateInput = document.getElementById("date-input");
const addBtn = document.getElementById("add-btn");
const expensesTablebody = document.getElementById("expnese-table-body");
const totalAmountCell = document.getElementById("total-amount");
const clearBtn = document.getElementById("clear-btn");
const resetBtn = document.getElementById("resetDataButton"); // New reset button

const salaryInput = document.getElementById("salaryInput");
const submitSalaryBtn = document.getElementById("submitSalaryBtn");
const balanceAmount = document.getElementById("balance-amount");

function addRupeeSymbol(amount) {
  return "₹ " + amount;
}

function calculateBalance() {
  balanceAmount.textContent = addRupeeSymbol(monthlySalary - totalAmount);
}

function updateCreditCards() {
  creditCardAmountElement.textContent = addRupeeSymbol(creditCardAmount);
}

function updateGivenLoans() {
  givenLoanAmountElement.textContent = addRupeeSymbol(givenLoanAmount);
}

function updateTakenLoans() {
  takenLoanAmountElement.textContent = addRupeeSymbol(takenLoanAmount);
}

function calculateBalance() {
  balanceAmount.textContent = addRupeeSymbol(monthlySalary - totalAmount);
}

submitSalaryBtn.addEventListener("click", () => {
  monthlySalary = Number(salaryInput.value);
  localStorage.setItem("monthlySalary", monthlySalary);
  balanceAmount.textContent = addRupeeSymbol(monthlySalary);
  calculateBalance();
});

addBtn.addEventListener("click", () => {
  const category = categorySelect.value;
  const amount = Number(amountInput.value);
  const date = dateInput.value;

  if (category === "") {
    alert("Please select the Category!");
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    alert("Please Enter valid amount!");
    return;
  }

  if (date === "") {
    alert("Please select a date!");
    return;
  }

  if (category !== "" && amount !== "" && date !== "") {
    clearBtn.style.display = "block";
  }

  clearBtn.addEventListener("click", () => {
    categorySelect.value = "";
    amountInput.value = "";
    dateInput.value = "";
    clearBtn.style.display = "none";
  });

  const expense = { category, amount, date };
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  totalAmount += amount;
  totalAmountCell.textContent = addRupeeSymbol(totalAmount);

  calculateBalance();

  if (category.includes("Card")) {
    creditCardAmount += amount;
    localStorage.setItem("creditCardAmount", creditCardAmount);
    updateCreditCards();
  } else if (category === "Given Loan") {
    givenLoanAmount += amount;
    localStorage.setItem("givenLoanAmount", givenLoanAmount);
    updateGivenLoans();
  } else if (category === "Taken Loan") {
    takenLoanAmount += amount;
    localStorage.setItem("takenLoanAmount", takenLoanAmount);
    updateTakenLoans();
  } else {
    // Regular expense
    totalAmount += amount;
    totalAmountCell.textContent = addRupeeSymbol(totalAmount);
    calculateBalance();
  }

  const newRow = expensesTablebody.insertRow();
  const categoryCell = newRow.insertCell();
  const amountCell = newRow.insertCell();
  const dateCell = newRow.insertCell();
  const deleteCell = newRow.insertCell();
  const deleteBtn = document.createElement("button");

  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", () => {
    expenses.splice(expenses.indexOf(expense), 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    totalAmount -= expense.amount;
    totalAmountCell.textContent = addRupeeSymbol(totalAmount);

    expensesTablebody.removeChild(newRow);
    calculateBalance();
  });

  categoryCell.textContent = expense.category;
  amountCell.textContent = addRupeeSymbol(expense.amount);
  dateCell.textContent = expense.date;
  deleteCell.appendChild(deleteBtn);
});

function loadExpenses() {
  totalAmount = 0;

  expenses.forEach((expense) => {
    totalAmount += expense.amount;

    const newRow = expensesTablebody.insertRow();
    const categoryCell = newRow.insertCell();
    const amountCell = newRow.insertCell();
    const dateCell = newRow.insertCell();
    const deleteCell = newRow.insertCell();
    const deleteBtn = document.createElement("button");

    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => {
      expenses.splice(expenses.indexOf(expense), 1);
      localStorage.setItem("expenses", JSON.stringify(expenses));

      totalAmount -= expense.amount;
      totalAmountCell.textContent = addRupeeSymbol(totalAmount);

      expensesTablebody.removeChild(newRow);
      calculateBalance();
    });

    categoryCell.textContent = expense.category;
    amountCell.textContent = addRupeeSymbol(expense.amount);
    dateCell.textContent = expense.date;
    deleteCell.appendChild(deleteBtn);
  });

  totalAmountCell.textContent = addRupeeSymbol(totalAmount);
  calculateBalance();
}

resetBtn.addEventListener("click", () => {
  // Clear local storage
  localStorage.removeItem("expenses");
  localStorage.removeItem("monthlySalary");
  localStorage.removeItem("creditCardAmount");
  localStorage.removeItem("givenLoanAmount");
  localStorage.removeItem("takenLoanAmount");

  // Reset variables
  expenses = [];
  totalAmount = 0;
  monthlySalary = 0;
  creditCardAmount = 0;
  givenLoanAmount = 0;
  takenLoanAmount = 0;

  // Clear the input fields
  categorySelect.value = "";
  amountInput.value = "";
  dateInput.value = "";
  salaryInput.value = "";

  // Clear the table body
  expensesTablebody.innerHTML = "";

  // Reset the displayed amounts
  totalAmountCell.textContent = addRupeeSymbol(totalAmount);
  balanceAmount.textContent = addRupeeSymbol(monthlySalary);
});

// Load expenses and salary when the page loads
window.onload = () => {
  balanceAmount.textContent = addRupeeSymbol(monthlySalary);
  loadExpenses();
};
