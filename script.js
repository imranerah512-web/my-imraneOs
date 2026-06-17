let selectedIcon = null;

// ================= 1. SYSTEM CLOCKS (DIGITAL, ANALOG & DATE) =================
function updateSystemTime() {
    const maintenant = new Date();
    
    // 1. Digital Clock (Top Bar)
    let heures = maintenant.getHours().toString().padStart(2, '0');
    let minutes = maintenant.getMinutes().toString().padStart(2, '0');
    let secondes = maintenant.getSeconds().toString().padStart(2, '0');
    document.getElementById('horloge').textContent = `${heures}:${minutes}:${secondes}`;
    
    // 2. System Date (Top Bar)
    let day = maintenant.getDate().toString().padStart(2, '0');
    let month = (maintenant.getMonth() + 1).toString().padStart(2, '0');
    let year = maintenant.getFullYear();
    document.getElementById('systemDate').textContent = `${day}/${month}/${year}`;

    // 3. Analog Clock Calculations (L-Mdawra)
    const seconds = maintenant.getSeconds();
    const secondsDegrees = ((seconds / 60) * 360) + 90;
    document.getElementById('secondHand').style.transform = `rotate(${secondsDegrees}deg)`;

    const mins = maintenant.getMinutes();
    const minsDegrees = ((mins / 60) * 360) + ((seconds/60)*6) + 90;
    document.getElementById('minHand').style.transform = `rotate(${minsDegrees}deg)`;

    const hour = maintenant.getHours();
    const hourDegrees = ((hour / 12) * 360) + ((mins/60)*30) + 90;
    document.getElementById('hourHand').style.transform = `rotate(${hourDegrees}deg)`;
}
setInterval(updateSystemTime, 1000);
updateSystemTime();


// ================= 2. INITIALISATION DYAL L-FENÊTRES & L-ICÔNES =================
function initializeWindow(appId) {
    const windowElement = document.getElementById(appId);
    const iconElement = document.getElementById(appId + "Icon");
    const closeButton = document.getElementById(appId + "close");

    dragElement(windowElement);

    if (iconElement) {
        iconElement.addEventListener("click", function(event) {
            event.stopPropagation(); 

            if (selectedIcon === iconElement) {
                windowElement.style.display = "block";
                document.querySelectorAll('.window').forEach(w => w.style.zIndex = 1);
                windowElement.style.zIndex = "10"; 
                iconElement.classList.remove("selected");
                selectedIcon = null;
            } else {
                if (selectedIcon) {
                    selectedIcon.classList.remove("selected");
                }
                iconElement.classList.add("selected");
                selectedIcon = iconElement;
            }
        });
    }

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            windowElement.style.display = "none";
        });
    }
}

document.body.addEventListener("click", () => {
    if (selectedIcon) {
        selectedIcon.classList.remove("selected");
        selectedIcon = null;
    }
});


// ================= 3. LOGIQUE DYAL DRAG ELEMENT =================
function dragElement(element) {
    var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
    
    if (document.getElementById(element.id + "header")) {
        document.getElementById(element.id + "header").onmousedown = startDragging;
    } else {
        element.onmousedown = startDragging;
    }

    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();
        
        document.querySelectorAll('.window').forEach(w => w.style.zIndex = 1);
        element.style.zIndex = 10;

        initialX = e.clientX;
        initialY = e.clientY;
        
        document.onmouseup = stopDragging;
        document.onmousemove = dragWindow;
    }

    function dragWindow(e) {
        e = e || window.event;
        e.preventDefault();
        
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        
        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


// ================= 4. PERSISTENCE DYAL L-NOTES =================
const noteInput = document.getElementById("noteInput");
if (noteInput) {
    noteInput.value = localStorage.getItem("webos_notes") || "";
}

function sauvegarderNote() {
    if (noteInput) {
        localStorage.setItem("webos_notes", noteInput.value);
        alert("Note saved successfully inside your personal OS storage! 💾");
    }
}


// ================= 5. INITIALISATION DYAL L-APPS =================
initializeWindow("welcome");
initializeWindow("notes");
initializeWindow("photo");
initializeWindow("projects");
