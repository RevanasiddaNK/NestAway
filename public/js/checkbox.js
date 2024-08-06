document.addEventListener("DOMContentLoaded", function() {
    const checkbox = document.querySelector('#s1-14');

    checkbox.addEventListener("change", function() {

        const priceElements = document.querySelectorAll('.price');
        priceElements.forEach( priceElement => {
            let originalPrice = parseFloat(priceElement.getAttribute('data-original-price'));
            if (checkbox.checked) {
                let newPrice = originalPrice + (18 / 100) * originalPrice;
                priceElement.innerText = `₹ ${newPrice.toLocaleString("en-IN")} / night`;
            } else {
                priceElement.innerText = `₹ ${originalPrice.toLocaleString("en-IN")} / night`;
            }
        });

    });
});