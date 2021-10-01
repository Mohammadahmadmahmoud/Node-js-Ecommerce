const express = require("express")
const router = express.Router()
const Product = require('../models/Prduct')
const { check, validationResult } = require('express-validator/check')
const moment = require('moment');
moment().format();

// middleware to check if user is loogged in

isAuthenticated = (req,res,next) => {
    if (req.isAuthenticated()) return next()
    res.redirect('/users/login')
}

//create new products

router.get('/create',isAuthenticated, (req,res)=> {
   
    res.render('product/create', {
        errors: req.flash('errors')
    })
})
// route to home products
router.get('/:pageNo?', (req,res)=> {   
    let pageNo = 1

    if ( req.params.pageNo) {
        pageNo = parseInt(req.params.pageNo)
    }
    if (req.params.pageNo == 0)   {
        pageNo = 1
    }
    
    let q = {
        skip: 5 * (pageNo - 1),
        limit: 5
    }
    //find totoal documents 
    let totalDocs = 0 

    Product.countDocuments({}, (err,total)=> {

    }).then( (response)=> {
        totalDocs = parseInt(response)
        Product.find({},{},q, (err,products)=> {
            //     res.json(products)
                 let chunk = []
                 let chunkSize = 3
                 for (let i =0 ; i < products.length ; i+=chunkSize) {
                     chunk.push(products.slice( i, chunkSize + i))
                 }
                 //res.json(chunk)
                  res.render('product/index', {
                      chunk : chunk,
                      message: req.flash('info'),
                      total: parseInt(totalDocs),
                      pageNo: pageNo
                  })
             })
    })

  
})


// save product to db

router.post('/create', [
    check('title').isLength({min: 3}).withMessage('Title should be more than 5 char'),
    check('description').isLength({min: 5}).withMessage('Description should be more than 5 char'),
    check('location').isLength({min: 3}).withMessage('Location should be more than 5 char'),
    check('date').isLength({min: 5}).withMessage('Date should valid Date'),

] , (req,res)=> {

    const errors = validationResult(req)

    if( !errors.isEmpty()) {
        
        req.flash('errors',errors.array())
        res.redirect('/products/create')
    } else {
        
        let newProduct = new Product({
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location,
            user_id:  req.user.id,
            created_at: Date.now()
        })

        newProduct.save( (err)=> {
            if(!err) {
                console.log('product was added')
                req.flash('info', ' The event was created successfuly')
                res.redirect('/products')
            } else {
                console.log(err)
            } 
        })
    }
   
})

// show single product
router.get('/show/:id', (req,res)=> {
    Product.findOne({_id: req.params.id}, (err,product)=> {
        
       if(!err) {
           
        res.render('product/show', {
            product: product
        })

       } else {
           console.log(err)
       }
    
    })
 
})

// edit route

router.get('/edit/:id', isAuthenticated,(req,res)=> {

    Product.findOne({_id: req.params.id}, (err,product)=> {
        
        if(!err) {
       
         res.render('product/edit', {
            product: product,
            productDate: moment(product.date).format('YYYY-MM-DD'),
             errors: req.flash('errors'),
             message: req.flash('info')
         })
 
        } else {
            console.log(err)
        }
     
     })

})

// update the form

router.post('/update',[
    check('title').isLength({min: 5}).withMessage('Title should be more than 5 char'),
    check('description').isLength({min: 5}).withMessage('Description should be more than 5 char'),
    check('location').isLength({min: 3}).withMessage('Location should be more than 5 char'),
    check('date').isLength({min: 5}).withMessage('Date should valid Date'),

], isAuthenticated,(req,res)=> {
    
    const errors = validationResult(req)
    if( !errors.isEmpty()) {
       
        req.flash('errors',errors.array())
        res.redirect('/products/edit/' + req.body.id)
    } else {
       // crete obj
       let newfeilds = {
           title: req.body.title,
           description: req.body.description,
           location: req.body.location,
           date: req.body.date
       }
       let query = {_id: req.body.id}

       Product.updateOne(query, newfeilds, (err)=> {
           if(!err) {
               req.flash('info', " The product was updated successfuly"),
               res.redirect('/products/edit/' + req.body.id)
           } else {
               console.log(err)
           }
       })
    }
   
})

//delete event

router.delete('/delete/:id',isAuthenticated, (req,res)=> {

    let query = {_id: req.params.id}

    Products.deleteOne(query, (err)=> {

        if(!err) {
            res.status(200).json('deleted')
        } else {
            res.status(404).json('There was an error .product was not deleted')
        }
    })
})

module.exports = router 