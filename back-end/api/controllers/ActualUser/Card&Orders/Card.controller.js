
const db = require('../../../models')();
const CartModel = db.Cart;
const ImageModel = db.ProductImages
const responseHandler = require('../../../utils/responseHandler')




module.exports = new class CartController{


/* ----------------------------------------------CREATE---------------------------------------*/
    async addToCart (req, res) {

        // check if it is already in the cart
        let exist_quantity = await CartModel.findOne({
            where: {
                user_id: req.user.user_id,  
                product_detail_id: req.body.product_detail_id
            }})
        

        if (exist_quantity === null ){
            await CartModel.create({
                user_id : req.user.user_id,
                product_detail_id: req.body.product_detail_id,
                name: req.body.name,
                price: req.body.price,
                quantity: req.body.quantity,    
                discount: req.body.discount,
                image: req.body.image,
                size: req.body.size       
            })
            .then(() => responseHandler.sendSuccess(req, res, 200, 'product added to cart successfully'))
            .catch( err => responseHandler.sendFailure(req, res, 400, err))
        }else{
            await CartModel.update({
                quantity:  exist_quantity.quantity + req.body.quantity
            },{
                where : {
                    user_id : req.user.user_id,
                    product_detail_id: req.body.product_detail_id
                }
            })
            .then(() => responseHandler.sendSuccess(req, res, 200, 'added to cart successfully'))
            .catch( err => responseHandler.sendFailure(req, res, 400, err))

        }
        


    }

/* ----------------------------------------------GET------------------------------------------*/
    async getAll(req, res) {

        await CartModel.findAll({
            where: {
                user_id: req.user.user_id
            }
        })
        .then(data => responseHandler.sendSuccess(req, res, 200, data))
        .catch( err => responseHandler.sendFailure(req, res, 400, err))       

    }



/* ----------------------------------------------UPDATE---------------------------------------*/
    async update (req, res){
        await CartModel.update(req.body ,{
            where : {
                id : req.body.id
            }
        })
        .then(() => responseHandler.sendSuccess(req, res, 200, 'updated successfully'))
        .catch( err => responseHandler.sendFailure(req, res, 400, err))
    }

/* ----------------------------------------------DELETE---------------------------------------*/
    async delete (req, res) {
        await CartModel.destroy({
            where : {
                id : req.params.id
            }
        })
        .then(() => responseHandler.sendSuccess(req, res, 200, "deleted successfully"))
        .catch( err => responseHandler.sendFailure(req, res, 400, err))
    }

};





