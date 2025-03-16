// Portfolio data
let portfolio = [];
let totalValue = 0;

// Function to update the portfolio table
function updatePortfolio() {
    const tableBody = document.getElementById("portfolio-table").getElementsByTagName("tbody")[0];
    tableBody.innerHTML = ""; // Clear previous entries

    portfolio.forEach((stock, index) => {
        const row = document.createElement("tr");
        const currentValue = (stock.price * stock.quantity).toFixed(2);
        const profitLoss = (stock.sellPrice ? (stock.sellPrice - stock.price) * stock.quantity : 0).toFixed(2);

        row.innerHTML = `
            <td>${stock.name}</td>
            <td>$${stock.price.toFixed(2)}</td>
            <td>${stock.quantity}</td>
            <td>$${currentValue}</td>
            <td>${stock.sellPrice > 0 ? "Profit/Loss: $" + profitLoss : "No sale yet"}</td>
            <td><button class="sell-btn" onclick="sellStock(${index})" ${stock.sellPrice > 0 ? "disabled" : ""}>Sell</button></td>
        `;
        tableBody.appendChild(row);
    });

    // Update total value
    document.getElementById("total-value").innerText = `$${totalValue.toFixed(2)}`;
}

// Function to buy stock
function buyStock() {
    const name = document.getElementById("stock-name").value;
    const price = parseFloat(document.getElementById("stock-price").value);
    const quantity = parseInt(document.getElementById("stock-quantity").value);

    if (!name || isNaN(price) || isNaN(quantity) || price <= 0 || quantity <= 0) {
        // Show error message in a stylish way
        showMessage("Please enter valid stock details!", "error");
        return;
    }

    // Add stock to portfolio
    portfolio.push({ name, price, quantity });
    totalValue += price * quantity;

    updatePortfolio(); // Refresh UI

    // Clear input fields
    document.getElementById("stock-name").value = "";
    document.getElementById("stock-price").value = "";
    document.getElementById("stock-quantity").value = "";

    // Show success message
    showMessage(`Successfully bought ${quantity} of ${name} at $${price.toFixed(2)} each!`, "success");
}

// Function to show success or error messages
function showMessage(message, type) {
    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", type);
    messageContainer.innerHTML = `
        <p class="message-text">${message}</p>
    `;

    document.body.appendChild(messageContainer);

    // Remove the message after 3 seconds
    setTimeout(() => {
        messageContainer.style.opacity = "0";
        setTimeout(() => {
            messageContainer.remove();
        }, 500);
    }, 3000);
}
document.getElementById("buy-stock").addEventListener("click",buyStock);

// Show the modal for entering selling price
function sellStock(index) {
    const stock = portfolio[index];

    // Set the stock name in the modal
    document.getElementById("stock-name-modal").innerText = stock.name;

    // Show the modal
    document.getElementById("sell-modal").style.display = "block";

    // Handle the confirmation of the sale
    document.getElementById("confirm-sell").onclick = function() {
        const sellPrice = parseFloat(document.getElementById("selling-price").value);

        if (isNaN(sellPrice) || sellPrice <= 0) {
            alert("Please enter a valid selling price.");
            return;
        }

        // Calculate profit or loss
        const profitLoss = (sellPrice - stock.price) * stock.quantity;

        // Update portfolio and total value
        totalValue -= stock.price * stock.quantity; // Remove buy price from total value
        totalValue += profitLoss; // Add profit or loss

        // Set the sell price and remove the stock from portfolio
        stock.sellPrice = sellPrice;
        portfolio.splice(index, 1);

        updatePortfolio(); // Refresh UI

        // Close the modal after sale
        document.getElementById("sell-modal").style.display = "none";

        // Show the profit/loss message
        showMessage(`You sold ${stock.quantity} of ${stock.name} for a 
            ${profitLoss >= 0 ? "profit" : "loss"} of $${Math.abs(profitLoss).toFixed(2)}!`, 
            profitLoss >= 0 ? "success" : "error");
    };
}

// Close the modal when the "X" button is clicked
document.getElementById("close-modal").onclick = function() {
    document.getElementById("sell-modal").style.display = "none";
};

// Close the modal if the user clicks outside the modal
window.onclick = function(event) {
    if (event.target === document.getElementById("sell-modal")) {
        document.getElementById("sell-modal").style.display = "none";
    }
};