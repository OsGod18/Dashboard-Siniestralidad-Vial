/* =========================================================
    UTILIDADES
========================================================= */



// Normaliza texto
const norm = txt => {
    if (!txt) return "";
    return txt
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
};

// Animación numérica (0 → valor final)
function animarNumero(el, final, duracion = 1200) {
    let actual = 0;
    const paso = final / (duracion / 120);

    function frame() {
        actual += paso;
        if (actual < final) {
            el.textContent = Math.round(actual);
            requestAnimationFrame(frame);
        } else {
            el.textContent = final;
        }
    }
    frame();
}

// Animación KPI Año
function animarAnios(el, lista, final) {
    let i = 0;
    const loop = setInterval(() => {
        el.textContent = lista[i % lista.length];
        i++;
    }, 4);

    setTimeout(() => {
        clearInterval(loop);
        el.textContent = final;
    }, 1500);
}

/* =========================================================
    DASHBOARD
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    Chart.defaults.color = "#FFFFFF";
    Chart.defaults.font.family = "Anta";


    console.log("dashboard_graficas.js cargado");
    console.log("Total registros:", datos.length);

    /* =========================
        KPI: TOTAL DE CASOS
    ========================= */
    animarNumero(
        document.getElementById("kpiTotal"),
        datos.length
    );

    /* =========================
        KPI: SEXO PREDOMINANTE
    ========================= */
    let hombres = 0;
    let mujeres = 0;

    datos.forEach(d => {
        const s = norm(d.sexo);
        if (s === "hombre") hombres++;
        if (s === "mujer") mujeres++;
    });

    const totalSexo = hombres + mujeres;
    const sexoPred = hombres > mujeres ? "Hombres" : "Mujeres";
    const porcentaje = Math.round(
        Math.max(hombres, mujeres) * 100 / totalSexo
    );

    document.getElementById("kpiSexo").textContent =
        `${sexoPred} ${porcentaje}%`;

    /* =========================
        KPI: AÑO CON MÁS CASOS
    ========================= */
    const conteoAnio = {};

    datos.forEach(d => {
        conteoAnio[d.anio] = (conteoAnio[d.anio] || 0) + 1;
    });

    let anioTop = "";
    let maxCasos = 0;

    for (let a in conteoAnio) {
        if (conteoAnio[a] > maxCasos) {
            maxCasos = conteoAnio[a];
            anioTop = a;
        }
    }

    animarAnios(
        document.getElementById("kpiAnio"),
        ["2021", "2022", "2023", "2024"],
        anioTop
    );

    document.getElementById("kpiAnioTop").textContent =
        `${maxCasos} casos`;

    /*=========================
        KPI: EDAD MÁS AFECTADA
    ========================= */
    const conteoEdad = {
    "18 a 28": 0,
    "29 a 59": 0,
    "60 o mas": 0
    };

    datos.forEach(d => {
    if (conteoEdad.hasOwnProperty(d.edad)) {
        conteoEdad[d.edad]++;
    }
    });

    let edadTop = "";
    let maxEdad = 0;

    for (let e in conteoEdad) {
        if (conteoEdad[e] > maxEdad) {
            maxEdad = conteoEdad[e];
            edadTop = e;
        }
    }



    document.getElementById("kpiEdad").textContent = edadTop;

    /* =====================================================
        GRAFICA: SEXO
    ===================================================== */
    new Chart(document.getElementById("graficaSexo"), {
        type: "bar",
        data: {
            labels: ["Hombres", "Mujeres"],
            datasets: [{
                label: "Casos de Sexo",
                data: [hombres, mujeres],
                backgroundColor: ["#42A5F5", "#EC407A"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 1200 }
            
        }
    });

    /* =====================================================
        GRAFICA: EDAD
    ===================================================== */
    new Chart(document.getElementById("graficaEdad"), {
    type: "bar",
    data: {
        labels: Object.keys(conteoEdad),
        datasets: [{
            label: "Casos por grupo de edad",
            data: Object.values(conteoEdad),
            backgroundColor: "#F2C94C"
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});


    /* =====================================================
        GRAFICA: AÑO
    ===================================================== */
    new Chart(document.getElementById("graficaAnio"), {
        type: "line",
        data: {
            labels: Object.keys(conteoAnio),
            datasets: [{
                label: "Casos por año",
                data: Object.values(conteoAnio),
                borderColor: "#4FC3F7",

                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    /* =====================================================
        GRAFICA: CICLO VITAL
    ===================================================== */
    const conteoCiclo = {
    "Juventud": 0,
    "Adultez": 0,
    "Adulto mayor": 0
    };

    datos.forEach(d => {
        const ciclo = norm(d.ciclo);

        if (ciclo.includes("juven")) conteoCiclo["Juventud"]++;
        else if (ciclo.includes("adulto mayor") || ciclo.includes("mayor")) {
            conteoCiclo["Adulto mayor"]++;
        }
        else if (ciclo.includes("adult")) conteoCiclo["Adultez"]++;
    });


    new Chart(document.getElementById("graficaCicloVital"), {
        type: "doughnut",
        data: {
            labels: Object.keys(conteoCiclo),
            datasets: [{
                data: Object.values(conteoCiclo),
                backgroundColor: ["#4FC3F7", "#81C784", "#FF8A65"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    /* =====================================================
        GRAFICA: ESCOLARIDAD
    ===================================================== */
    const conteoEscolaridad = {};

    datos.forEach(d => {
        conteoEscolaridad[d.escolaridad] =
            (conteoEscolaridad[d.escolaridad] || 0) + 1;
    });

    new Chart(document.getElementById("graficaEscolaridad"), {
        type: "bar",
        data: {
            labels: Object.keys(conteoEscolaridad),
            datasets: [{
                label: "Casos de Escolaridad",
                data: Object.values(conteoEscolaridad),
                backgroundColor: "#BA68C8"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    /* =====================================================
       GRAFICA: ESTADO CIVIL
    ===================================================== */
    const conteoEstado = {};

    datos.forEach(d => {
        conteoEstado[d.estado] =
            (conteoEstado[d.estado] || 0) + 1;
    });

    new Chart(document.getElementById("graficaEstadoCivil"), {
        type: "pie",
        data: {
            labels: Object.keys(conteoEstado),
            datasets: [{
                data: Object.values(conteoEstado),
                backgroundColor: ["#90CAF9", "#A5D6A7", "#FFCC80"]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

/* =====================================================
   GRAFICA: SEXO × EDAD
===================================================== */

let h_18_28 = 0, m_18_28 = 0;
let h_29_59 = 0, m_29_59 = 0;
let h_60 = 0, m_60 = 0;

datos.forEach(d => {
    const sexo = norm(d.sexo);
    const edad = norm(d.edad);

    if (edad === "18 a 28") {
        if (sexo === "hombre") h_18_28++;
        if (sexo === "mujer") m_18_28++;
    }

    if (edad === "29 a 59") {
        if (sexo === "hombre") h_29_59++;
        if (sexo === "mujer") m_29_59++;
    }

    if (edad === "60 o mas") {
        if (sexo === "hombre") h_60++;
        if (sexo === "mujer") m_60++;
    }
});

new Chart(document.getElementById("graficaSexoEdad"), {
    type: "bar",
    data: {
        labels: ["18 a 28", "29 a 59", "60 o más"],
        datasets: [
            {
                label: "Hombres",
                data: [h_18_28, h_29_59, h_60],
                backgroundColor: "#42A5F5"
            },
            {
                label: "Mujeres",
                data: [m_18_28, m_29_59, m_60],
                backgroundColor: "#EC407A"
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: "#F7F7F7" }
            }
        },
        scales: {
            x: { ticks: { color: "#F7F7F7" } },
            y: { ticks: { color: "#F7F7F7" } }
        },
        animation: {
            duration: 1200,
            easing: "easeOutQuart"
        }
    }
});


});
