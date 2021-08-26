const router = require('express').Router()
const Item = require('./items-model')
  const {
    validateContent,
    validateId,
  } = require('./items-midware')

// GET ITEMS
router.get('/', (req, res, next) => {
    Item.getAll()
    .then(items => {
      res.json(items);
    })
    .catch(err => res.send(err));
})

//GET BY /:ID  
router.get("/:id",  validateId, (req, res) => {
    const id = req.params.id;
    Item.findById(id)
      .then(item => {
        res.status(200).json(item);
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });

// >>>>>> Middleware start
  // function validateContent(req, res, next) {
  //   if (!req.body) {
  //     res.status(400).json({ message: "Items field is required." });
  //   } else {
  //     next();
  //   }
  // }
// >>>>>> Middleware ends


  // add middleware to validate user
  router.post('/add-item', validateContent , (req, res) => {
    Item.addItem(req.body)
    .then(item => {
      res.status(200).json(item);
    })
    .catch(err => {
      res.status(500).json(err);
    });
})


  // add middleware to validate user
  router.put('/:id', validateId, validateContent, (req, res, next) => {
    const {id} = req.params;
  const changes = req.body;
  Item.updateItem(id, changes)
    .then(updatedItem => {
      res.status(201).json(updatedItem);
    })
    .catch(err => {
      res.status(500).json(err);
    });
})

// validate user id
router.delete('/:id', validateId, (req, res) => {
  const id = req.params.id;
  Item.deleteItem(id)
    .then(deletedItem => {
      res.status(200).json({ message: `Item with id ${id} successfully deleted.`});
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


module.exports = router