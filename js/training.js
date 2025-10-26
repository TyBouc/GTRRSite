// Google Apps Script endpoint URLs
const shortURL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLj17DwOBqKGUCqMuhWEoU-IR04pw_RLXFCfIKaODHo-H97v6JvVgq0USZk2AuviCNT453ar5r4JldE8e3f3Dc7E_EuzzhbqxKZzfPFrgkR0GndQ5jaNX9E__GhoTlGJBd-NJdzXwAMvtRCMnF2glFtn2SE_vWOGMKPicix9htKfqG3LK8kzXm4dsr0uIYP72FnHZhsjiNtTOp6yD5_Ylw2_hlRKf_tkrlHJdoepuLdS6Lmw4RGqNsaVZgaPw7couXH_qSEXSes-N5XhUctxEmD-ex2Lf5I7ezhgW3e0&lib=MFIn001NRq5VrBW4hotLJniJkt3D8Y0Py';
const mediumURL = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhSVFrT2xZX6ri4ZGkGMFOHp9xXQlO6hRft8o0hgqnQ3HXIInjFyF72eolAUpC0dkjzrabEM9uf-wzxOAYwfZMPuWIXsszOQNv71fM6YIzQCUThlg6mPqLJ-U1PstNn4PhwPAAoFih51m3d1LtAxFBGRoY3l4SYo6_l96TvLAfd_V5u23ehlLZTW9VtTCprE8gwvlU1Q2ee4lG2YAqJ_oIPT8li4Si-TheyzRKOnwaf4fv9oafOyjKSyXT0469wZ8S5QXB7hu1sXGhoov-cLWnhnBhU4H_ZMWOgIKc7&lib=MFIn001NRq5VrBW4hotLJniJkt3D8Y0Py';
const longURL = 'https://script.google.com/macros/s/AKfycbyru7IFox99NXLTwFNaHzoYbmSTYIkvp-5xWtuLEWPzlSy77gTIkxqg8hwKMWT_OdYYHw/exec';
const sprintURL = 'fill';
const liftURL = 'fill';

const planData = {
    short: { url: shortURL, name: 'Short-Mileage Group' },
    medium: { url: mediumURL, name: 'Medium-Mileage Group' },
    long: { url: longURL, name: 'Long-Mileage Group' },
    sprint: { url: sprintURL, name: 'Sprint Group' },
    lifts: { url: liftURL, name: 'Lifts & Drills' }
};

const buttons = document.querySelectorAll('.plan-btn');

// Day labels for each week
const daysOfWeek = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

/**
 * Fetches plan data from a given API endpoint and calls the render function.
 */
async function fetchPlanAPI(apiURL, planName) {
    const planInfoDiv = document.querySelector('.plan-info');
    planInfoDiv.innerHTML = `<p>Loading the ${planName} plan ...</p>`;

    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        renderPlanTable(data, planName);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        planInfoDiv.innerHTML = `<p>Error loading ${planName} plan. Please try again later.</p>`;
        return null;
    }
}

/**
 * Render a clean, modern weekly training table.
 */
function renderPlanTable(data, planName) {
    const planInfoDiv = document.querySelector('.plan-info');

    if (!data || !Array.isArray(data) || data.length === 0) {
        planInfoDiv.innerHTML = `<p>Error: Could not load the training plan for ${planName}.</p>`;
        return;
    }

    let htmlContent = `
        <h2 class="plan-title">${planName} — Week of Training</h2>
        <div class="training-table-wrapper">
            <table class="training-table">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Mileage</th>
                        <th>Workout</th>
                        <th>Route</th>
                        <th>Coach’s Notes</th>
                    </tr>
                </thead>
                <tbody>
    `;

    data.forEach((dayPlan, index) => {
        const values = Object.values(dayPlan);

        const day = daysOfWeek[index % daysOfWeek.length];
        const mileage = values[1] || '-';
        const workout = values[2] || 'Easy Mileage';
        const route = values[5] || '-';
        const coachNotes = values[6] || '-';

        htmlContent += `
            <tr>
                <td class="day-cell">${day}</td>
                <td>${mileage}</td>
                <td>${workout}</td>
                <td>${route}</td>
                <td>${coachNotes}</td>
            </tr>
        `;
    });

    htmlContent += `
                </tbody>
            </table>
        </div>
    `;

    planInfoDiv.innerHTML = htmlContent;
}

/**
 * Highlights the active plan button.
 */
function updateActiveButton(activeButton) {
    buttons.forEach(btn => btn.classList.remove('active'));
    activeButton.classList.add('active');
}

/**
 * Handles click event on plan buttons.
 */
function handleClick(e) {
    const planId = e.currentTarget.dataset.plan;
    const planInfo = planData[planId];

    if (!planInfo) {
        console.error(`No data found for plan: ${planId}`);
        return;
    }

    fetchPlanAPI(planInfo.url, planInfo.name);
    updateActiveButton(e.currentTarget);
}

// Attach event listeners
buttons.forEach(button => button.addEventListener('click', handleClick));
