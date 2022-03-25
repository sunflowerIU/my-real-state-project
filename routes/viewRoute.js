const express = require('express')
const router = express()
const viewController = require('./../controllers/viewController')
const authController = require('./../controllers/authController')



//1. main page
router.get('/',authController.isLoggedIn,viewController.getMainPage)

//2. productpage
router.get('/product/:slug',authController.isLoggedIn,viewController.getProduct)

//3. contact us
router.get('/contact-us',authController.isLoggedIn,viewController.contactUs)

//4. signup
router.get('/auth',viewController.auth)

//5. create Property
router.get('/create-property',authController.protect,viewController.createProperty)


//5. my account page
router.get('/my-account',authController.protect,viewController.account)


//6. forgot password
router.get('/forgot-password',viewController.forgotPassword)


//7. reset password
router.get('/reset-password/:token',viewController.resetPassword)


router.all('*',(req,res,next)=>{
    res.status(404).render('error',{
        title:'Page not found'
    })
}
)




module.exports = router