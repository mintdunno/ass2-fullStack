<form class="mb-4" action="/customer/priceFilter/<%= customer._id %>" method="post">
    <label for="minPrice">Min price:</label>
    <input type="number" name="min" id="minPrice" value="0">
        <label for="maxPrice">Max price:</label>
        <input type="number" name="max" id="maxPrice">
            <button class="text-light bg-dark rounded ms-3" type="submit">Filter</button>
        </form>