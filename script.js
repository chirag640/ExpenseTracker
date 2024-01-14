const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const totalExpense = document.getElementById('totalExpense');

let expenses = [];

function capitalizeWords(str) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.textContent = `Total Expense: ₹${(progress * (end - start) + start).toFixed(2)}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
expenseForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const category1 = document.getElementById('expenseCategory').value;
    const category = capitalizeWords(category1);
    const amount = parseFloat(document.getElementById('expenseAmount').value);

    if (category && !isNaN(amount)) {
        const expenseItem = document.createElement('li');
        expenseItem.className = 'expense-item';
        expenseItem.innerHTML = `
            <span>${category}</span>
            <span>₹${amount.toFixed(2)}</span>
        `;
        expenseList.appendChild(expenseItem);

        expenses.push(amount);

        document.getElementById('expenseCategory').value = '';
        document.getElementById('expenseAmount').value = '';

        // Start counting animation for total expense from the current total
        animateValue(totalExpense, parseFloat(totalExpense.textContent.split('₹')[1]), expenses.reduce((acc, curr) => acc + curr, 0), 1500);

        // Send the data to the server
        const formData = new FormData();
        formData.append('expenseCategory', category);
        formData.append('expenseAmount', amount);
        try {
            await fetch('/submitExpense', {
                method: 'POST',
                body: formData,
            });
        } catch (error) {
            console.error('Error submitting expense:', error);
        }
    } else {
        alert('Please fill in both category and a valid amount.');
    }
});

function updateTotalExpense() {
  const total = expenses.reduce((acc, curr) => acc + curr, 0).toFixed(2);
  totalExpense.textContent = `Total Expense: ₹${total}`;
}
