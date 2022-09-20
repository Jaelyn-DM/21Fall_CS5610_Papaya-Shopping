import express from "express";
import pkg from "@prisma/client";
import morgan from "morgan";
import cors from "cors";
import jwt from "express-jwt";
import jwks from "jwks-rsa";

var requireAuth = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: process.env.AUTH0_JWK_URI,
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

// TABLE user
// Get user detail by id
app.get("/api/user/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        cart: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not exist");
    }
  } catch (e) {
    res.status(400).send("Bad request");
  }
});

// Get user cart detail by name with string
app.get("/api/user-by-name/:username", async (req, res) => {
  try {
    const name = req.params.username;
    const user = await prisma.user.findUnique({
      where: {
        name: name,
      },
      include: {
        cart: true,
      },
    });

    if (user) {
      const cartItems = await prisma.cartItem.findMany({
        where: {
          cartId: user.cart.id,
        },
        include: {
          item: true,
        },
      });

      res.json(cartItems);
    } else {
      res.status(404).send("User not exist");
    }
  } catch (e) {
    res.status(400).send("Bad request");
  }
});

// Get user cart by name with string
app.get("/api/user-cart-by-name/:username", async (req, res) => {
  try {
    const name = req.params.username;
    const user = await prisma.user.findUnique({
      where: {
        name: name,
      },
      include: {
        cart: true,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not exist");
    }
  } catch (e) {
    res.status(400).send("Bad request");
  }
});

// verify user status, if not registered in our database we will create it
app.post("/verify-user", requireAuth, async (req, res) => {
  const auth0Id = req.user.sub;
  const email = req.user[`${process.env.AUTH0_AUDIENCE}/email`];
  const name = req.user[`${process.env.AUTH0_AUDIENCE}/nickname`];

  const user = await prisma.user.findUnique({
    where: {
      auth0Id,
    },
  });

  if (user) {
    res.json(user);
  } else {
    const newUser = await prisma.user.create({
      data: {
        email,
        auth0Id,
        name,
      },
    });

    // Create a new cart for the new user
    const newCart = await prisma.cart.create({
      data: {
        user: { connect: { id: newUser.id } },
      },
    });

    res.json(newUser);
  }
});

// TBALE item

// Get all items in database
app.get("/api/allitems", async (req, res) => {
  try {
    const items = await prisma.item.findMany({});
    res.json(items);
  } catch (e) {
    res.status(400).send("Bad request");
  }
});
// Get item detail by id
app.get("/api/item/:id", async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const item = await prisma.item.findUnique({
      where: {
        id: itemId,
      },
    });

    if (item) {
      res.json(item);
    } else {
      res.status(404).send("Item not exist");
    }
  } catch (e) {
    res.status(400).send("Bad request");
  }
});

// Create a new item
app.post("/api/newitem", async (req, res) => {
  try {
    const { title, price, image, description } = req.body;
    // Validate for empty input
    if (!title || !price) {
      res.status(400).send("Bad Request, invalid item");
      return;
    }

    const newItem = await prisma.item.create({
      data: {
        title,
        price,
        image,
        description,
      },
    });

    res.json(newItem);
  } catch (e) {
    console.log(e);
    res.status(400).send("Bad Request");
  }
});

// update item by id
app.put("/api/update/:id", async (req, res) => {
  try {
    const idFind = parseInt(req.params.id);
    const updateInfo = req.body;

    // Validate for empty input
    if (!updateInfo.title || !updateInfo.price) {
      res.status(400).send("Bad Request");
      return;
    }

    const updateItem = await prisma.item.update({
      where: {
        id: idFind,
      },
      data: {
        title: updateInfo.title,
        price: updateInfo.price,
        image: updateInfo.image,
        description: updateInfo.description,
      },
    });

    // Refresh the result to the new item.
    const findReslut = await prisma.item.findUnique({
      where: {
        id: idFind,
      },
    });

    res.status(200).json(findReslut);
  } catch (e) {
    res.status(400).send("Bad Request");
  }
});

// Delete item by id
app.delete("/api/deleteitem/:id", async (req, res) => {
  try {
    const idFind = parseInt(req.params.id);
    const deleteItem = await prisma.item.delete({
      where: {
        id: idFind,
      },
    });

    if (deleteItem) {
      res.status(200).json(deleteItem);
    } else {
      res.status(404).send("Item not exist");
    }
  } catch (e) {
    res.status(400).send("Bad Request");
  }
});

// TABLE cart
// Add item to cart by cart id and item id from items
app.put("/api/addtocart", async (req, res) => {
  try {
    const { cartId, itemId } = req.body;

    if (
      !cartId ||
      !Number.isInteger(cartId) ||
      !itemId ||
      !Number.isInteger(itemId)
    ) {
      res.status(400).send("Bad request, invalid cart or item");
      return;
    }

    // Check if the cart exists
    const thisCart = await prisma.cart.findUnique({
      where: {
        id: cartId,
      },
    });
    if (!thisCart) {
      res.status(404).send("Cart not exist");
      return;
    }
    // Find the item in the Item table
    const thisItem = await prisma.item.findUnique({
      where: {
        id: itemId,
      },
    });

    if (thisItem) {
      // Check if the item is in the cart already
      const thisCartItem = await prisma.cartItem.findFirst({
        where: {
          itemId: itemId,
          cartId: cartId,
        },
      });

      if (thisCartItem) {
        // If the item is in the cart, add quantity by 1
        const newCartItem = await prisma.cartItem.update({
          where: {
            id: thisCartItem.id,
          },
          data: {
            quantity: thisCartItem.quantity + 1,
          },
        });
        res.status(200).json(newCartItem);
        return;
      } else {
        // If not, create new cart item
        const newCartItem = await prisma.cartItem.create({
          data: {
            cart: { connect: { id: cartId } },
            item: { connect: { id: thisItem.id } },
            quantity: 1,
          },
        });
        res.status(200).json(newCartItem);
      }
    } else {
      res.status(404).send("Item not found");
      return;
    }
  } catch (e) {
    res.status(400).send("Bad request");
  }
});

// Remove one item from cart by cart id and cart item id from cart items
app.put("/api/removeoneitem", async (req, res) => {
  try {
    const { cartId, cartItemId } = req.body;

    if (
      !cartId ||
      !Number.isInteger(cartId) ||
      !cartItemId ||
      !Number.isInteger(cartItemId)
    ) {
      res.status(400).send("Bad request, invalid cart or item");
      return;
    }

    const thisCartItem = await prisma.cartItem.findUnique({
      where: {
        id: cartItemId,
      },
    });

    if (thisCartItem) {
      // If the quantity of this cart item is larger than 1
      if (thisCartItem.quantity > 1) {
        const newCartItem = await prisma.cartItem.update({
          where: {
            id: thisCartItem.id,
          },
          data: {
            quantity: thisCartItem.quantity - 1,
          },
        });
        res.status(200).json(newCartItem);
      } else {
        // If the quantity of this catt item is 1, delete this cart item
        const deleteCartItem = await prisma.cartItem.delete({
          where: {
            id: thisCartItem.id,
          },
        });
        res.status(200).json(deleteCartItem);
      }
    } else {
      res.status(404).send("Cart item not exist");
    }
  } catch (e) {
    res.status(400).send("Bad request");
  }
});

// Remove all quantity of a cart item by cart item id
app.delete("/api/deletecartitem/:id", async (req, res) => {
  try {
    const cartItemId = parseInt(req.params.id);
    const cartItemDelete = await prisma.cartItem.delete({
      where: {
        id: cartItemId,
      },
    });

    if (cartItemDelete) {
      res.status(200).json(cartItemDelete);
    } else {
      res.status(404).send("Item not exist");
    }
  } catch (e) {
    res.status(400).send("Bad request");
  }
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000 ");
});

const PORT = parseInt(process.env.PORT) || 8080;
app.listen(PORT, () => {
 console.log(`Server running on http://localhost:${PORT} 🎉 🚀`);
});
