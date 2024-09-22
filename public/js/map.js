
if (!MAP_TOKEN) {
    console.error('Mapbox token is not set!');
} 
else{

    let coordinates = listing.geometry.coordinates;
    let title = listing.title;
    mapboxgl.accessToken = MAP_TOKEN;

    document.addEventListener('DOMContentLoaded', () => {
       
    
        mapboxgl.accessToken = MAP_TOKEN;
    
        const start = {
            center: coordinates,
            zoom: 1,
        };
        const end = {
            center: coordinates,
            zoom: 14,
        };
    
        const map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/standard',
            ...start
        });

        let isAtStart = true;
    
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY || document.documentElement.scrollTop;
            
            // Define the scroll threshold
            const scrollThreshold = 700; // Adjust this value as needed
    
            if (scrollPosition > scrollThreshold && isAtStart) {
                isAtStart = false;
                map.flyTo({
                    ...end,
                    duration: 5000, // Fly to the end point over 5 seconds
                    essential: true
                });
            }
        });

        const marker = new mapboxgl.Marker({ color: 'red' })
        .setLngLat(coordinates)
        .setPopup(
            new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
                <h4> ${title} </h4> 
                <p> Exact location will be provided after booking </p>
                `))
            .setLngLat(coordinates)
        .addTo(map)

    });
    
}
