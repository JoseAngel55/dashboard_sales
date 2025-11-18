// ======================
// URLs de tus APIs reales
// ======================
const API_SALES_BY_CATEGORY = "https://pnqqx8vov2.execute-api.us-east-1.amazonaws.com/default/sales-by-category";
const API_PROFIT_MARGIN = "https://9dsja5jc16.execute-api.us-east-1.amazonaws.com/default/profit-margin";
const API_QUANTITY_BY_REGION = "https://lqo7pykt20.execute-api.us-east-1.amazonaws.com/default/quantity-by-region";
const API_TOP5_PRODUCTS = "https://8j8r9l77ac.execute-api.us-east-1.amazonaws.com/default/top5-products";

// =============================
// 1. Ventas por categoría (Barras)
// =============================
async function loadSalesByCategory() {
    const response = await fetch(API_SALES_BY_CATEGORY);
    const data = await response.json();
    const categories = Object.keys(data.data);
    const totals = Object.values(data.data);

    new Chart(document.getElementById("salesByCategoryChart"), {
        type: "bar",
        data: {
            labels: categories,
            datasets: [{
                label: "Ventas totales ($)",
                data: totals
            }]
        }
    });
}

// =============================
// 2. Margen de ganancia (Líneas)
// =============================
async function loadProfitMargin() {
    const response = await fetch(API_PROFIT_MARGIN);
    const data = await response.json();
    
    const products = data.data.map(i => i.product_name);
    const margins = data.data.map(i => i.margin_percent);

    new Chart(document.getElementById("profitMarginChart"), {
        type: "line",
        data: {
            labels: products,
            datasets: [{
                label: "Margen (%)",
                data: margins
            }]
        }
    });
}

// =============================
// 3. Cantidad por región (Pie)
// =============================
async function loadQuantityByRegion() {
    const response = await fetch(API_QUANTITY_BY_REGION);
    const data = await response.json();

    new Chart(document.getElementById("quantityByRegionChart"), {
        type: "pie",
        data: {
            labels: Object.keys(data.data),
            datasets: [{
                data: Object.values(data.data)
            }]
        }
    });
}

// =============================
// 4. Top 5 productos por región (Doughnut)
// =============================
async function loadTopProducts() {
    const response = await fetch(API_TOP5_PRODUCTS);
    const data = await response.json();

    const container = document.getElementById("topProductsContainer");
    container.innerHTML = "";

    Object.keys(data.data).forEach(region => {
        const regionDiv = document.createElement("div");
        regionDiv.innerHTML = `
            <h3>${region}</h3>
            <canvas id="chart-${region}"></canvas>
        `;
        container.appendChild(regionDiv);

        const productNames = data.data[region].map(p => p.product_name);
        const totals = data.data[region].map(p => p.total_sales);

        new Chart(document.getElementById(`chart-${region}`), {
            type: "doughnut",
            data: {
                labels: productNames,
                datasets: [{
                    data: totals
                }]
            }
        });
    });
}

// =============================
// Ejecutar todo al cargar
// =============================
loadSalesByCategory();
loadProfitMargin();
loadQuantityByRegion();
loadTopProducts();
