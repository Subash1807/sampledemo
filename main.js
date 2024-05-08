// Initialize Google Maps directions service
const directionsService = new google.maps.DirectionsService();

// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    // Get references to HTML elements
    const routeForm = document.getElementById("route-form");
    const startLocationInput = document.getElementById("start-location");
    const endLocationInput = document.getElementById("end-location");
    const map = L.map("map").setView([51.505, -0.09], 13); // Set the initial map view

    // Add a Tile Layer (You can use different map providers)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Initialize a variable to hold the route polyline
    let routePolyline = null;

    // Add an event listener to the form for route planning
    routeForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission

        // Get start and end locations from user input
        const startLocation = startLocationInput.value;
        const endLocation = endLocationInput.value;

        // Calculate the route using Google Maps Directions Service
        calculateAndDisplayRoute(startLocation, endLocation);
    });

    // Function to calculate and display the route using Google Maps
    function calculateAndDisplayRoute(startLocation, endLocation) {
        // Request the route from Google Maps
        directionsService.route(
            {
                origin: startLocation,
                destination: endLocation,
                travelMode: google.maps.TravelMode.DRIVING, // You can change this mode
            },
            function (response, status) {
                if (status === "OK") {
                    // Clear any existing route from the map
                    if (routePolyline) {
                        map.removeLayer(routePolyline);
                    }

                    // Display the new route on the map
                    const route = response.routes[0];
                    const routeCoordinates = [];
                    for (const leg of route.legs) {
                        for (const step of leg.steps) {
                            for (const path of step.path) {
                                routeCoordinates.push([path.lat(), path.lng()]);
                            }
                        }
                    }

                    routePolyline = L.polyline(routeCoordinates, { color: 'blue' }).addTo(map);

                    // Fit the map view to the route bounds
                    map.fitBounds(routePolyline.getBounds());
                } else {
                    alert("Directions request failed: " + status);
                }
            }
        );
    }
});


