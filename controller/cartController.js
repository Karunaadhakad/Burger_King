import cartSchema from "../model/cartSchema.js"
import orderSchema from "../model/orderSchema.js";


export const addToCartController = async(request,response)=>{
    const email = request.payload.email;
    console.log("email ",email);
    const { userId, name, price } = request.body;

    try {
      // Find existing cart for the user
      let individualCart = await cartSchema.findOne({ userId , email});  
      // If no cart exists, create a new one
      if (!individualCart) {
        individualCart = new cartSchema({ email,userId, items: [] });
      }  
      // Check if item already exists in the cart
      const itemIndex = individualCart.items.findIndex((item) => item.name === name); //findIndex is used to find index of first element that satisfies any condition
  
      if (itemIndex > -1) {
        // If item exists, increment its quantity
        individualCart.items[itemIndex].quantity += 1;
      } else {
        // If item does not exist, add it to the cart
        individualCart.items.push({ name, price, quantity: 1 });
      }
  
      // Save the updated cart
      await individualCart.save();
      const cart = await cartSchema.find({email:email});
      const cartCount = cart.length;
      // console.log("cart length ",cart.length);
      const updateStatus = {
        $set:{
          cartCount:cartCount
        }
      }
      const result = await cartSchema.updateMany({email:email},updateStatus);

      // console.log("result ",result);
  
      // Redirect to cart page
      // response.render("cart",{cart:cart,cartCount:cartCount});
      // alert("added to cart");
      // console.log("request.payload ",request.payload);
      response.render("BrowseFood",{email:request.payload.email,cartCount});
      // res.redirect(`/cart?cartCount=${cartCount}`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      response.status(500).send('Internal Server Error');
    }
}

export const placeOrderController = async(request,response)=>{
      try {
      // console.log("request.body ",request.body);
        const userId = request.body.userId;
        const item = await cartSchema.findOne({userId});
        const email = item.email;
        // console.log("item ",email);
        const currentDate = new Date();

        var itemObj = {
          email:email,
          userId:userId,
          name:item.items[0].name,
          price:item.items[0].price,
          quantity:item.items[0].quantity,
          totalAmount : (item.items[0].price * item.items[0].quantity),
          orderDate:currentDate
        }

        const result = await orderSchema.create(itemObj);
        const orders = await orderSchema.find({email});
        response.render("viewOrder",{email,orders});
      } catch (error) {
        console.log("error in placeorderController ",error);
        if(error.code==11000){
          const cart = await cartSchema.find({email:request.payload.email});
          const cartCount = cart.length;
          response.render("viewCart",{cart,cartCount,message:"Already ordered"});
         
        }
      }
}

export const viewCartController = async(request,response)=>{
  try {
    const cart = await cartSchema.find({email:request.payload.email});
    const cartCount = cart.length;
    // console.log("cart ",cart);
    
    // console.log("cart Count ", request.session.cartCount);
    response.render("viewCart", {cart, cartCount,message:""});
  } catch (error) {
      console.log("error in viewCartController ",error);
      response.render("PageNotFound");
  }
}

export const deleteOrderController = async(request,response)=>{
  try {
    // console.log("request.query ",request.query);
    const userId = request.query.userId;
    // const item = await cartSchema.findOne({userId});
    // console.log("item ",item);

    const result = await cartSchema.deleteOne({userId});
    if(result.deletedCount){
      const cart = await cartSchema.find({email:request.payload.email});
      const cartCount = cart.length;
      const updateStatus = {
        $set:{
          cartCount:cartCount
        }
      }

      const res = await cartSchema.updateMany({email:request.payload.email},updateStatus);
      response.render("viewCart",{cart,cartCount,message:""});
    }
  } catch (error) {
    console.log("error in deleteOrderController ",error);
    response.render("PageNotFound");
  }
}