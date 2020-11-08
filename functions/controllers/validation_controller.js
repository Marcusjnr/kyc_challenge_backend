
class ValidationController{
  static async validateBVN(req, res){
      if(req.body.dob ==='1980/12/12' || req.body.dob === '1980-12-12'){
          return res.send({
              valid: true,
              dob: req.body.dob,
              phoneNumber: '08127793318'
          })
      }

      return res.send({
          valid: false,
          dob: req.body.dob,
          phoneNumber: '08127793318'
      })
  }
}

module.exports = {
    validateBVN: ValidationController.validateBVN
};
