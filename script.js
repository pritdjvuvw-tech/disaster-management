/* =========================================
   NAVIGATION
========================================= */

function openCitizen() {

    document
        .getElementById("citizen")
        .scrollIntoView({
            behavior: "smooth"
        });

}


function openGovernment() {

    document
        .getElementById("command")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================
   I AM ALIVE
========================================= */

function confirmAlive() {

    const message =
        document.getElementById("aliveMessage");

    message.classList.remove("hidden");

    const button =
        document.querySelector(".alive-button");

    button.innerHTML =
        "✓ ALIVE STATUS CONFIRMED";

    button.style.background =
        "#15803d";

    /*
       In the real system this information
       would be sent to the backend.
    */

    console.log("SURVIVOR STATUS: ALIVE");

    getLocation();

}


/* =========================================
   SOS
========================================= */

function sendSOS() {

    const message =
        document.getElementById("sosMessage");

    message.classList.remove("hidden");

    const button =
        document.querySelector(".sos-button");

    button.innerHTML =
        "✓ SOS SENT";

    button.style.background =
        "#991b1b";

    /*
       Real application:
       send SOS to backend / emergency server.
    */

    console.log("EMERGENCY SOS SENT");

    getLocation();

}


/* =========================================
   GET GPS LOCATION
========================================= */

function getLocation() {

    const result =
        document.getElementById("locationResult");

    const coordinates =
        document.getElementById("coordinates");


    if (!navigator.geolocation) {

        coordinates.innerHTML =
            "Geolocation is not supported by this browser.";

        result.classList.remove("hidden");

        return;
    }


    coordinates.innerHTML =
        "Requesting GPS location...";

    result.classList.remove("hidden");


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;

            const accuracy =
                Math.round(
                    position.coords.accuracy
                );


            coordinates.innerHTML =

                `Latitude: ${latitude.toFixed(6)}
                <br>
                Longitude: ${longitude.toFixed(6)}
                <br>
                GPS Accuracy: approximately ${accuracy} metres`;


            console.log(
                "LOCATION:",
                latitude,
                longitude
            );

        },


        function(error) {

            let errorMessage;

            switch(error.code) {

                case error.PERMISSION_DENIED:

                    errorMessage =
                        "Location permission denied.";

                    break;

                case error.POSITION_UNAVAILABLE:

                    errorMessage =
                        "Location information unavailable.";

                    break;

                case error.TIMEOUT:

                    errorMessage =
                        "Location request timed out.";

                    break;

                default:

                    errorMessage =
                        "Unable to retrieve location.";

            }


            coordinates.innerHTML =
                errorMessage;

        }

    );

}


/* =========================================
   RESCUE TEAM DISPATCH
========================================= */

function dispatchTeam(personID) {

    const confirmed =
        confirm(
            `Dispatch rescue team to ${personID}?`
        );


    if (confirmed) {

        alert(
            `🚁 RESCUE TEAM DISPATCHED\n\n` +
            `Survivor: ${personID}\n` +
            `Team: RT-17\n` +
            `Status: EN ROUTE`
        );


        console.log(
            "RESCUE TEAM DISPATCHED:",
            personID
        );

    }

}


/* =========================================
   DEMO LIVE CLOCK
========================================= */

function updateClock() {

    const now =
        new Date();

    console.log(
        "System time:",
        now.toLocaleTimeString()
    );

}

setInterval(
    updateClock,
    1000
);
