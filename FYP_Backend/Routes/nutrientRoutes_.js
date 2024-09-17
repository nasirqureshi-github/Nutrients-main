const express = require("express");
const nutrientsController = require("../Controllers/nutrientControllers");
const { isAdmin, authMiddleware } = require("../Middleware/authMiddleware");
const router = express.Router();

// router.use(authMiddleware); 
router.get(
    "/nutrient",
    nutrientsController.getnutrient
);
router.post(
    "/add-source",
    nutrientsController.addSource
);
router.get(
    "/get-source/:name",
    nutrientsController.getSource
);
router.put(
    "/update-source/:id",
    nutrientsController.updateSource
);
router.delete(
    "/delete-source/:id",
    nutrientsController.deleteSource
);
router.get(
    "/get-allsource/",
    nutrientsController.deletgetallsourceeSource
);
router.get(
    "/cities",
    nutrientsController.getCities
);
router.post(
    "/cities",
    nutrientsController.addCities
);
router.put(
    "/cities/:id",
    nutrientsController.updateCities
);
router.delete(
    "/cities/:id",
    nutrientsController.deleteCities
);
router.get(
    "/provience",
    nutrientsController.Provience_
);
router.get(
    "/get",
    nutrientsController.Nutritional_
);
router.get(
    "/all",
    nutrientsController.getAllSourcesNutritional
);
router.post('/prices',nutrientsController.addPrice)
router.get('/prices',nutrientsController.getPrices)
router.put('/prices/:id',nutrientsController.updatePrices)



router.delete(
    "/source/:id",
    nutrientsController.deletesource
);
router.post(
    "/getsource",
    nutrientsController.getAllSources
);
router.put(
    "/updatesource/:id",
    nutrientsController.updateSource
);

module.exports = router;
