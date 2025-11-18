// ======================
// URLs de tus APIs reales
// ======================
const API_SALES_BY_CATEGORY = "https://pnqqx8vov2.execute-api.us-east-1.amazonaws.com/default/sales-by-category";
const API_PROFIT_MARGIN = "https://9dsja5jc16.execute-api.us-east-1.amazonaws.com/default/profit-margin";
const API_QUANTITY_BY_REGION = "https://lqo7pykt20.execute-api.us-east-1.amazonaws.com/default/quantity-by-region";
const API_TOP5_PRODUCTS = "https://8j8r9l77ac.execute-api.us-east-1.amazonaws.com/default/top5-products";

// ========== Helper para parsear API Gateway ==========
async function fetchJSON(url) {
    const res = await fetch(url);
    let data = await res.json();

    // Si body viene como string (caso común)
    if (data.body && typeof data.body === "string") {
        data = JSON.parse(data.body);
    }

    return data;
}

// =============================
// 1. Ventas por categoría (Barras)
// =============================
async function loadSalesByCategory() {
    try {
        const data = await fetchJSON(API_SALES_BY_CATEGORY);

        const categories = data.categories.map(c => c.category);
        const totals = data.categories.map(c => c.total_sales);

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

    } catch (err) {
        console.error("Error en SalesByCategory:", err);
    }
}

// =============================
// 2. Margen de ganancia (Líneas)
// =============================
async function loadProfitMargin() {
    try {
        const data = await fetchJSON(API_PROFIT_MARGIN);

        const categories = data.categories.map(c => c.category);
        const margins = data.categories.map(c => c.average_margin);

        new Chart(document.getElementById("profitMarginChart"), {
            type: "line",
            data: {
                labels: categories,
                datasets: [{
                    label: "Margen promedio",
                    data: margins
                }]
            }
        });

    } catch (err) {
        console.error("Error en ProfitMargin:", err);
    }
}

// =============================
// 3. Cantidad por región (Pie)
// =============================
async function loadQuantityByRegion() {
    try {
        const data = await fetchJSON(API_QUANTITY_BY_REGION);

        const regions = Object.keys(data.regions);
        const quantities = regions.map(r => data.regions[r].total_quantity);

        new Chart(document.getElementById("quantityByRegionChart"), {
            type: "pie",
            data: {
                labels: regions,
                datasets: [{
                    data: quantities
                }]
            }
        });

    } catch (err) {
        console.error("Error en QuantityByRegion:", err);
    }
}

// =============================
// 4. Top 5 productos por región (Doughnut)
// =============================
async function loadTopProducts() {
    try {
        const data = await fetchJSON(API_TOP5_PRODUCTS);

        const container = document.getElementById("topProductsContainer");
        container.innerHTML = "";

        Object.keys(data.regions).forEach(region => {
            const regionDiv = document.createElement("div");
            regionDiv.innerHTML = `
                <h3>${region}</h3>
                <canvas id="chart-${region}"></canvas>
            `;
            container.appendChild(regionDiv);

            const products = data.regions[region].products;
            const productNames = products.map(p => p.product_name);
            const totals = products.map(p => p.total_sales);

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

    } catch (err) {
        console.error("Error en Top5Products:", err);
    }
}

// =============================
// Ejecutar todo al cargar
// =============================
loadSalesByCategory();
loadProfitMargin();
loadQuantityByRegion();
loadTopProducts();
