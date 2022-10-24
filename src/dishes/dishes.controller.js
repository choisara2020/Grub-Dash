const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /dishes handlers needed to make the tests pass
//validate functions for create and update
//validate body has NAME
function bodyHasNameProperty(req, res, next) {
    const { data = {} } = req.body;
    if(!data.name) {
        next({
            status: 400,
            message: "Dish must include a name."
        });
    }
    res.locals.reqBody = data;
    return next();
}

//validate body has DESCRIPTION
function bodyHasDescriptionProperty(req, res, next) {
    const reqBody = res.locals.reqBody;

    if(!reqBody.description) {
        next({
            status:400,
            message: "Dish must include a description."
        });
    }
    return next();
}

//validate body has PRICE
function bodyHasPriceProperty(req, res, next) {
    const reqBody = res.locals.reqBody;

    if (!reqBody.price || reqBody.price < 0 || typeof reqBody.price !== "number") {
        next({
            status: 400,
            message: "Dish must include a price and it must be an integer greater than 0.",
        });
    }
    return next();
}

//validate body has image_url
function bodyHasImageUrlProperty(req, res, next) {
    const reqBody = res.locals.reqBody;

    if (!reqBody["image_url"]) {
        next({
            status: 400,
            message: "Dish must include a image_url",
        });
    }
    return next();
}

//validation for read and update
//does the dish exist? dishId
function dishExists(req, res, next) {
    const { dishId } = req.params;
    const foundDish = dishes.find((dish) => dish.id === dishId);

    if (foundDish) {
        res.locals.dish = foundDish;
        res.locals.dishId = dishId;
        return next();
    }
    next({
        status: 404,
        message: `Dish does not exist: ${dishId}.`
    });
}

//validate for update
// body id matches route id
function bodyIdMatchesRouteId(req, res, next) {
    const dishId = res.locals.dishId;
    const reqBody = res.locals.reqBody;

    if(reqBody.id) {
        if(reqBody.id === dishId) {
            return next();
        }
        next({
            status: 400,
            message: `Dish id does not match route id. Dish: ${reqBody.id}, Route: ${dishId}`,
        });
    }
    return next();
}

//Route handlers

//updates a dish
function update(req, res) {
    const dish = res.locals.dish;
    const reqBody = res.locals.reqBody;

//Creating array of property names
const existingDishProperties = Object.getOwnPropertyNames(dish);

for (let i=0; i < existingDishProperties.length; i++) {
    //Accessing each dish object key within the array
    let propName = existingDishProperties[i];
    //Updating each value if there 
    if (dish[propName] !== reqBody[propName]) {
        dish[propName] = reqBody[propName];
    }
}
res.json({ data: dish })
}

//create new dish
function create(req, res) {
    const reqBody = res.locals.reqBody;
    const newDish = {
        ...reqBody,
        id: nextId(),
    };
    dishes.push(newDish);
    res.status(201).json({ data: newDish })
}

//returns 1 dish
function read(req, res) {
    res.json({ data: res.locals.dish })
}

//returns all dishes
function list(req, res) {
res.json({ data: dishes });
}

//export everything!!!!!!!
module.exports = {
    create: [
      bodyHasNameProperty,
      bodyHasDescriptionProperty,
      bodyHasPriceProperty,
      bodyHasImageUrlProperty,
      create,
    ],
    read: [dishExists, read],
    update: [
      dishExists,
      bodyHasNameProperty,
      bodyHasDescriptionProperty,
      bodyHasPriceProperty,
      bodyHasImageUrlProperty,
      bodyIdMatchesRouteId,
      update,
    ],
    list,
  };