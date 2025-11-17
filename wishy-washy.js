//Name: Amoya Collins
//ID: 2408831
//Assignment#: Individual Assignment #2
//Day/Time of Class: Tuesday @ 11:00 AM
//Module Name/Module Code: CIT2011 - Web Development
//Free Hosting Link: https://amoya-c.github.io/IA2-web-programming/

window.onload = function(){
    const signUpButton = document.getElementById("sign-up-button");
    const signInButton = document.getElementById("sign-in-button");

    //Sign Up
    if (signUpButton) {
        signUpButton.onclick = function(event){
            event.preventDefault();
            let Name = document.getElementById("name").value;
            let DOB = document.getElementById("dob").value;
            let Address = document.getElementById("address").value;
            let Email = document.getElementById("email").value;
            let Username = document.getElementById("username").value;
            let Password = document.getElementById("password").value;

            //Validation of inputs
            if (!Name || !DOB || !Address || !Email || !Username || !Password){
                alert("Please fill out all fields to continue.");
                return;
            }

            if (Password.length < 9){
                alert("Password must be at least 9 characters.");
                return;
            }
            
            //Storage
            localStorage.setItem("name", Name);
            localStorage.setItem("dob", DOB);
            localStorage.setItem("address", Address);
            localStorage.setItem("email", Email);
            localStorage.setItem("username", Username);
            localStorage.setItem("password", Password);

            //Success message
            alert("Account creation was successful!");

            //redirect to sign-in
            window.location.href = "index.html";
        };
    }
    //Sign In
    if (signInButton) {
        signInButton.onclick = function(event){
        event.preventDefault();
        let Username = document.getElementById("username").value;
        let Password = document.getElementById("password").value;

        let savedUsername = localStorage.getItem("username");
        let savedPassword = localStorage.getItem("password");

        //Validation of inputs
        if (!Username || !Password){
            alert("Please enter username and password to continue.");
            return;
        }

        if (Username == savedUsername && Password == savedPassword){
            window.location.href = "products.html";     //redirect to Products Page
        } else {
            alert("Incorrect username or password. Please try again");
        } 
    };
    } 
    
    //Add to Cart
    const buttons = document.querySelectorAll(".atc-button");

    buttons.forEach((button)=> {
        button.addEventListener("click", ()=> {
            const product = button.closest(".product");
            const image = product.querySelector(".product-img").getAttribute("src");
            const name = product.querySelector(".product-name").textContent;
            const priceText = product.querySelector(".product-price").textContent;
            const price = parseFloat(priceText.replace(/[^0-9.]/g, ""));

            let cart = JSON.parse(localStorage.getItem("cart")) || [];

            //Look for existing items
            const exist = cart.find(item => item.name === name);

            if (exist){
                exist.qty++;
                alert("Item added to cart again!");
            } else {
                cart.push({ image, name, qty: 1, price});
                alert("Item added to cart!");
            }

            localStorage.setItem("cart", JSON.stringify(cart));
        });
    });


    //Display Cart
    const cartContainer = document.getElementById("cart-items");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0){
            cartContainer.innerHTML = "<p>Your cart is empty</p>";
            } else {
                let subtotal = 0.00;
                cartContainer.innerHTML = "";

                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.qty;
                    subtotal += itemTotal;

                    const productCell = document.createElement("div");
                    productCell.classList.add("cart-row");
                    productCell.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" style="width: 100px;">
                        <p>${item.name}</p>
                    `;
                    cartContainer.appendChild(productCell);

                    const priceCell = document.createElement("div");
                    priceCell.classList.add("cart-row");
                    priceCell.innerHTML = `<p>$${item.price.toFixed(2)}</p>`;
                    cartContainer.appendChild(priceCell);

                    const quantityCell = document.createElement("div");
                    quantityCell.classList.add("cart-row");
                    quantityCell.innerHTML = `
                        <button class="qty-btn" data-action="minus" data-index="${index}">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" data-action="plus" data-index="${index}">+</button>
                    `;
                    cartContainer.appendChild(quantityCell);

                    const subtotalCell = document.createElement("div");
                    subtotalCell.classList.add("cart-row");
                    subtotalCell.innerHTML = `
                            <p> $${itemTotal.toFixed(2)}</p>
                            <button class="remove-btn" data-index="${index}">X</button>
                            <br><br>
                    `;
                    cartContainer.appendChild(subtotalCell);
                });

                //Totals
                document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
                const shipping = 0.00;
                document.getElementById("shipping").innerText = `$${shipping.toFixed(2)}`;
                const total = subtotal + shipping;
                document.getElementById("cart-total").innerText = `$${total.toFixed(2)}`;

                //Quantity
                document.querySelectorAll(".qty-btn").forEach(btn => {
                    btn.addEventListener("click", () => {
                        // let cart = JSON.parse(localStorage.getItem("cart"));
                        const index = btn.dataset.index;

                        if (btn.dataset.action === "minus" && cart[index].qty > 1){
                            cart[index].qty--;
                        }else if (btn.dataset.action === "plus"){
                            cart[index].qty++;
                        }
                        localStorage.setItem("cart", JSON.stringify(cart));
                        location.reload();
                    });
                });

                //Revove product from cart
                document.querySelectorAll(".remove-btn").forEach(btn => {
                    btn.addEventListener("click", () => {
                        // let cart = JSON.parse(localStorage.getItem("cart"));
                        const index = btn.dataset.index;
                        cart.splice(index, 1);
                        localStorage.setItem("cart", JSON.stringify(cart));
                        location.reload();
                    });
                });

                //Checkout Button
                const checkoutButton =  document.getElementById("checkout-button");
                if (checkoutButton){
                    checkoutButton.onclick = function(event){
                        event.preventDefault();

                        const fullName = localStorage.getItem("name");
                        const address = localStorage.getItem("address");

                        if (!fullName || !address){
                            checkoutContainer.innerHTML = "<p>No shipping details found.</p>";
                        }
                        //redirect to checkout
                        window.location.href = "checkout.html";
                    };
                }
            }
        //Checkout
        const checkoutButton =  document.getElementById("checkout-button");
        if (checkoutButton){
            checkoutButton.onclick = function(event) {
                event.preventDefault();
                //redirect to checkout
                window.location.href = "checkout.html";
                
                const fullName = localStorage.getItem("name");
                const address = localStorage.getItem("address");

                const checkoutContainer = document.getElementById("shipping-details");
                    chechoutContainer.innerHTML = "";

                if (checkoutContainer.innerHTML && fullName && address){
                    const nameCell = document.createElement("div");
                    nameCell.classList.add("shipping-row");
                    nameCell.innerHTML = `
                        <p>${fullName}</p>
                        <p>${address}</p>
                    `;
                    checkoutContainer.appendChild(nameCell);
                }
            
            };
        }

        // const checkoutButton =  document.getElementById("checkout-button");
        // const checkoutContainer = document.getElementById("shipping-details");
        // const fullName = localStorage.getItem("name") || [];
        // const address = localStorage.getItem("address") || [];
        
        // if (checkoutButton){
        //     checkoutButton.onclick = function(event){
        //         event.preventDefault();
        //         window.location.href = "checkout.html";

        //         checkoutContainer.innerHTML = "";
        //         if (fullName.length === 0 || address.length === 0){
        //             window.alert("No shipping deatils found.");
        //         } else {
        //             const nameCell = document.createElement("div");
        //             nameCell.classList.add("shipping-row");
        //             nameCell.innerHTML = `
        //                 <p>${fullName}</p>
        //                 <p>${address}</p>
        //             `;
        //             checkoutContainer.appendChild(nameCell);
        //         }
        //     }

        // }


}




